import assert from 'node:assert/strict';
import test from 'node:test';
import { checkReleaseAge } from '../scripts/check-release-age.mjs';

const now = Date.parse('2026-11-13T00:00:00Z');
const lock = {
  lockfileVersion: 3,
  packages: {
    '': { name: 'synthetic-app' },
    'node_modules/@example/package': {
      version: '1.0.0', resolved: 'https://registry.npmjs.org/@example/package/-/package-1.0.0.tgz',
    },
    'node_modules/parent/node_modules/@example/package': {
      version: '1.1.0', resolved: 'https://registry.npmjs.org/@example/package/-/package-1.1.0.tgz',
      optional: true,
    },
  },
};

test('locked nested/optional versions are checked; a release exactly seven days old is accepted', async () => {
  let requests = 0;
  const result = await checkReleaseAge(lock, {
    now,
    metadataFor: async (name) => {
      assert.equal(name, '@example/package');
      requests++;
      return { time: { '1.0.0': '2026-10-01T00:00:00Z', '1.1.0': '2026-11-06T00:00:00Z' } };
    },
  });
  assert.equal(result, 1);
  assert.equal(requests, 1);
});

test('a recent version already in a lockfile is rejected', async () => {
  await assert.rejects(checkReleaseAge(lock, {
    now,
    metadataFor: async () => ({ time: { '1.0.0': '2026-10-01T00:00:00Z', '1.1.0': '2026-11-06T00:00:01Z' } }),
  }), /@example\/package@1.1.0.*less than 7 days old/);
});

test('missing metadata, failed requests and unapproved sources fail closed', async () => {
  await assert.rejects(checkReleaseAge(lock, { now, metadataFor: async () => ({}) }), /missing or invalid publication time/);
  await assert.rejects(checkReleaseAge(lock, {
    now, metadataFor: async () => ({ time: { '1.0.0': 'not-a-date', '1.1.0': 'not-a-date' } }),
  }), /missing or invalid publication time/);
  await assert.rejects(checkReleaseAge(lock, {
    now, metadataFor: async () => { throw new Error('Registry unavailable'); },
  }), /Registry unavailable/);
  const external = structuredClone(lock);
  external.packages['node_modules/@example/package'].resolved = 'https://unapproved.invalid/package.tgz';
  await assert.rejects(checkReleaseAge(external), /Non-registry source is not approved/);
});
