# Arithmetic Calculator UI

[![tests](https://github.com/OswaldoRodriguez123/arithmetic-calculator-ui/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/OswaldoRodriguez123/arithmetic-calculator-ui/actions/workflows/tests.yml)

Vue 3 single-page app for the
[arithmetic calculator API](https://github.com/OswaldoRodriguez123/arithmetic-calculator-api).
Users sign in, run operations from the API catalog and review the
records each operation creates. The session JWT travels as an httpOnly
cookie — it is never exposed to JavaScript.

## Features

- **Sign in** with username and password; on success the API sets an
  httpOnly session cookie (`SameSite=Lax` in development, `SameSite=None;
  Secure` in production). JavaScript never sees the token.
- **Dashboard** with the available operations and the user's current balance.
- **New operation**: pick an operation, enter the numbers it needs and submit
  it. The API charges the operation cost and stores the result.
- **Records**: paginated table with sorting, search and soft delete.
- **Session handling**: the router guard probes `GET /auth/me` before
  protected routes and hydrates the display profile; a `401` anywhere logs
  the user out, clears the stored profile and reloads to the sign-in page.

## Stack

- Vue 3 (Options API) + Vite
- Vue Router and Pinia
- PrimeVue (DataTable, InputText, Column)
- Axios
- Bootstrap 5 and Material Kit 2 styles
- Vitest + `@vue/test-utils` with `happy-dom`

## Getting started

Requires Node.js 20+ and a running instance of the
[API](https://github.com/OswaldoRodriguez123/arithmetic-calculator-api).

```bash
npm ci
cp example.env .env
npm run dev
```

The app starts on <http://localhost:3000>.

## Environment variables

```text
VITE_API_URL=http://localhost:3001/
```

`VITE_API_URL` is the base URL of the API. The client appends `api/v1` to it,
so the example above calls `http://localhost:3001/api/v1/...`.

**`npm run build` fails unless `VITE_API_URL` is set** to an `https://` URL
(`http://` is accepted only for loopback hosts: `localhost`, `127.0.0.1`,
`::1`). Builds that would otherwise bake a plain-http remote API origin into
the bundle are refused instead. Development (`npm run dev`) falls back to
`http://localhost:3001/` with a warning. When forking or self-hosting, also
update `connect-src` in the CSP `<meta>` tag in
[`index.html`](index.html) to the new API origin (default and production
origins are already listed there).

## Security posture

What the hardening pass (run-1 security audit) fixed:

- **No third-party code runs on the authenticated origin.** Font Awesome,
  Roboto/Roboto Slab and Material Icons Round are self-hosted (the mutable
  `kit.fontawesome.com` script tag from the CDN kit is gone). The sign-in
  background photo (Unsplash, `photo-1497294815431-9365093b7331`) is vendored
  in `src/assets/img/`.
- **CSP** via `<meta http-equiv="Content-Security-Policy">` in `index.html`:
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  font-src 'self'; img-src 'self' data:; connect-src …`. Note:
  `frame-ancestors 'none'` **cannot be expressed in a meta tag** — the static
  host serving this app must send it (and ideally `Strict-Transport-Security`,
  `Referrer-Policy`) as HTTP headers.
- **Token storage (resolved).** The JWT lives in an httpOnly cookie set by
  the API at login; `localStorage['user']` only holds a non-sensitive
  display profile (`id`, `name`, `username`) for instant paint. No script
  can read the session cookie, so the XSS-exfiltration path is closed.
  Deploy requirement: the API must run `NODE_ENV=production` with
  `CORS_ORIGIN=https://oswaldorodriguez123.github.io` (the API refuses to
  boot in production without it) and serve the UI over HTTPS.
- **`401` anywhere** clears the stored profile and store state and reloads
  to `/sign-in`. The API's `401` is the actual enforcement point.
- The single `v-html` in the tree (user-records actions cell) was replaced by
  a static, accessible button. `grep -r v-html src` returns nothing.
- **Router guard** (`beforeEach`) probes `GET /auth/me` when the page has no
  verified session yet, hydrates Pinia + the display profile, and redirects
  to sign-in on failure. The API remains the actual enforcement point (401).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serve the production build on port 4173 |
| `npm run lint` | ESLint (with `--fix`) |
| `npm run test:unit` | Vitest |

## Structure

```text
src/
├── assets/              # styles, fonts and the few images in use
├── components/          # Material Design components (input, button, table...)
├── pages/
│   ├── index/           # dashboard
│   ├── layout/          # shell and navbar
│   ├── new-operation/   # operation form and its spec
│   ├── sign-in/         # login form and its spec
│   └── user-records/    # records table and its spec
├── router/              # routes
├── services/            # API client, auth, operations and records
├── stores/              # Pinia store
└── utils/               # validation helpers
```

## Tests

```bash
npm run test:unit -- --run
```

Vitest covers the sign-in form, the new-operation form, the records table,
`MaterialDataTable` (no HTML injection, accessible actions button), the
`401`/logout flow, `getUserDataStorage`, the router auth guard (session
probe, redirects and hydration) and the `validate-api-url` build guard.
35 tests across 9 files.

## Remaining work / not fixed here

- **14 known vulnerabilities** remain in `npm audit` — all of them require
  breaking upgrades (Vue 3.2 → newer, Vite 2.9 → 5+, Vitest 0.32 → newer,
  `happy-dom`). They need a dedicated upgrade branch, not an audit fix.
- **Cookie session co-versioning.** The SPA and the API must be deployed
  together: older APIs without `/auth/me` cannot serve the router guard,
  and this UI does not send `Authorization` headers.
- **`frame-ancestors`, HSTS, `Referrer-Policy`** must be sent as HTTP headers
  by the static host (GitHub Pages / fork's host); the CSP `<meta>` tag cannot
  express `frame-ancestors`.
- **Font Awesome webfont licenses**: FA Free is CC BY 4.0 / SIL OFL — the
  bundled CSS retains attribution. No trademark claim either way.

## License

MIT. See [LICENSE](LICENSE).
