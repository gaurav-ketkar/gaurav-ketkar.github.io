# gaurav-ketkar.github.io
Personal website &amp; blog — Gaurav Ketkar

## Development and security

Use Node 24.22.2 (`.nvmrc`) and npm 11.21.2 (`packageManager` and strict engines).
Run project code only in a disposable, unprivileged VM/container with no host
credentials and registry-only outbound HTTPS. Run `npm run check:release-age` before
`npm ci --ignore-scripts --min-release-age=7`, then run `npm audit`, `npm test` and
`npm run build`. No dependency install/build lifecycle scripts are approved or
needed. Explicit test/build commands still execute dependency code and need isolation.

This is a public **static** Astro site on GitHub Pages; there is no app server,
database or private administration API. Contact Cleaner processes imported contacts
in browser memory and exports local files; it must never send them to a service.
The optional `PUBLIC_CF_ANALYTICS_TOKEN` and `PUBLIC_CLARITY_PROJECT_ID` are public
site analytics identifiers, not credentials. The rest of the site uses external
Google Fonts and optional analytics; no server secrets belong in its assets.

CI checks PRs without deployment privileges. Its non-sudo build user has a scrubbed
environment, no saved checkout token and IPv4 registry-HTTPS/loopback-only egress
(IPv6 loopback only). Only the separate main-branch deploy job gets Pages/OIDC
permissions. Actions are SHA-pinned and refreshed by Dependabot; npm routine updates
have a seven-day cooldown in both npm and Dependabot. Review security fixes blocked
by the age gate for an exact, approved, expiring exception rather than bypassing it.
The release-age precheck also verifies every locked version (including dev/optional
packages) against public registry timestamps and fails if metadata is unavailable.
This is necessary because npm's resolution-age setting alone accepts existing
locked versions without rechecking their age.

The security update moves Astro to 7 and MDX to 8 because the audit's affected
Astro ranges include the old major. Content uses glob loaders and entry IDs while
retaining blog URLs, Markdown processing and HTML whitespace behavior. Tailwind 3,
its configuration and typography remain; Vite's PostCSS pipeline replaces the
Astro-5-only Tailwind integration. The typography-scoped `postcss-selector-parser`
6.1.5 override replaces its vulnerable exact 6.0.10 pin; remove it when upstream
ships a patched dependency.

Read the [repository security baseline](.github/instructions/app-security.instructions.md)
before app work and review it against the maintained productivity baseline when
security policy changes. Do not deploy or change external access without approval.
