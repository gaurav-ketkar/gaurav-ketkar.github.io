import { readFile } from 'node:fs/promises';

const minimumAgeMs = 7 * 24 * 60 * 60 * 1000;

async function fetchMetadata(name) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Registry metadata request failed for ${name}: HTTP ${response.status}`);
  return response.json();
}

export async function checkReleaseAge(lock, { now = Date.now(), metadataFor = fetchMetadata } = {}) {
  if (lock.lockfileVersion !== 3 || !lock.packages) throw new Error('Expected an npm v3 lockfile with packages');
  const packages = new Map();
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (location === '') continue;
    if (!location.includes('node_modules/') || !entry.version || !entry.resolved || entry.link) {
      throw new Error(`Unsupported locked dependency at ${location}`);
    }
    const url = new URL(entry.resolved);
    if (url.origin !== 'https://registry.npmjs.org' || url.username || url.password) {
      throw new Error(`Non-registry source is not approved: ${location}`);
    }
    const name = entry.name || location.slice(location.lastIndexOf('node_modules/') + 'node_modules/'.length);
    if (!packages.has(name)) packages.set(name, new Set());
    packages.get(name).add(entry.version);
  }
  const pending = [...packages];
  const failures = [];
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(8, pending.length) }, async () => {
    while (index < pending.length) {
      const [name, versions] = pending[index++];
      const metadata = await metadataFor(name);
      for (const version of versions) {
        const published = Date.parse(metadata.time?.[version]);
        if (!Number.isFinite(published)) {
          failures.push(`${name}@${version}: missing or invalid publication time`);
        } else if (now - published < minimumAgeMs) {
          failures.push(`${name}@${version}: published ${new Date(published).toISOString()} (less than 7 days old)`);
        }
      }
    }
  }));
  if (failures.length) throw new Error(`Lockfile release-age check failed:\n${failures.sort().join('\n')}`);
  return packages.size;
}

if (import.meta.main) {
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  const count = await checkReleaseAge(lock);
  console.log(`Verified seven-day release age for all locked versions of ${count} packages, including optional/dev dependencies.`);
}
