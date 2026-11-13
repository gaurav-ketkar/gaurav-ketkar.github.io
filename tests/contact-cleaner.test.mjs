import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('../public/tools/contact-cleaner.html', import.meta.url), 'utf8');

function openCleaner(t, values) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
  t.after(() => dom.window.close());
  const { window } = dom;
  const api = window.eval(`${window.document.querySelector('script').textContent}
    ;({
      load(text) {
        const parsed = parseVCardFile(text);
        contacts = parsed.parsed;
        rawVCards = parsed.raws;
        detectDuplicates();
        render();
        openDupGame();
      },
      render,
      chooseCompanySort() { currentSort = 'company'; render(); },
      choices() { return dgChoices[0]; },
      contacts() { return contacts; },
      merge() { dgMerge(0); }
    });`);
  const vcf = values.map((value) => [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${value.lastName || 'Example'};Test;;;`,
    `FN:${value.name || 'Test Example'}`,
    'EMAIL:synthetic@example.invalid',
    `ORG:${value.company || 'Example Company'}`,
    `TITLE:${value.title || 'Example Title'}`,
    `BDAY:${value.birthday || '2000-01-01'}`,
    'END:VCARD',
  ].join('\n')).join('\n');
  api.load(vcf);
  return { api, document: window.document };
}

test('imported birthdays remain literal text throughout duplicate review and merge', (t) => {
  const birthday = '<img src=x onerror="globalThis.contactLeak=true">';
  const { api, document } = openCleaner(t, [{ birthday }, {}]);
  const preview = document.querySelector('.dg-preview');
  assert.ok(preview.textContent.includes(birthday));
  assert.equal(document.querySelector('img, [onerror]'), null);
  api.merge();
  assert.equal(api.contacts()[0].birthday, birthday);
  assert.equal(api.contacts()[1].status, 'delete');
});

test('merge choices preserve quotes, entities and handler payloads without creating attributes', (t) => {
  const payloads = [
    `Different "' name &quot; onmouseover="globalThis.contactLeak=true" <svg onload=alert(1)>`,
    `O'Brien\\'),globalThis.contactLeak=true)//`,
    'Ordinary alternative',
  ];
  const { api, document } = openCleaner(t, payloads.map((value) => ({
    name: value, company: value, title: value,
  })));
  const rows = [...document.querySelectorAll('.dg-preview .pc')];
  assert.equal(rows.length, 3);
  assert.equal(rows[0].children[0].textContent, payloads[0]);
  for (let i = 0; i < rows.length; i++) {
    const option = document.querySelectorAll('.dg-preview .pc')[i].children[1];
    assert.equal(option.textContent, payloads[1]);
    assert.equal(option.getAttribute('onclick'), null);
    option.click();
    assert.equal(api.choices()[['fullName', 'company', 'title'][i]], payloads[1]);
  }
  assert.equal(document.querySelector('svg, [onload], [onmouseover]'), null);
  api.merge();
  assert.equal(api.contacts()[0].fullName, payloads[1]);
  assert.equal(api.contacts()[0].company, payloads[1]);
  assert.equal(api.contacts()[0].title, payloads[1]);
});

test('protection controls use literal imported names and companies with removable tags', (t) => {
  const value = `O'Brien\\'),alert(1)// " onmouseover="alert(1)" <img src=x>`;
  const { api, document } = openCleaner(t, [{ lastName: value, company: value }, {}]);
  const protectName = [...document.querySelectorAll('.ca button[title]')]
    .find((button) => button.title === `Keep all ${value}`);
  assert.equal(protectName.title, `Keep all ${value}`);
  assert.equal(protectName.getAttribute('onclick'), null);
  protectName.click();
  const nameTag = document.querySelector('#pl-names .ptag');
  assert.ok(nameTag.textContent.includes(value.toLowerCase()));
  nameTag.querySelector('.rm').click();
  assert.equal(document.querySelector('#pl-names .ptag'), null);
  api.chooseCompanySort();
  const protectCompany = [...document.querySelectorAll('.group-header')]
    .find((group) => group.textContent.includes(value)).querySelector('button');
  assert.equal(protectCompany.getAttribute('onclick'), null);
  protectCompany.click();
  const companyTag = document.querySelector('#pl-companies .ptag');
  assert.ok(companyTag.textContent.includes(value.toLowerCase()));
  companyTag.querySelector('.rm').click();
  assert.equal(document.querySelector('#pl-companies .ptag'), null);
  assert.equal(document.querySelector('img, [onmouseover]'), null);
});
