# Arithmetic Calculator UI

[![tests](https://github.com/OswaldoRodriguez123/arithmetic-calculator-ui/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/OswaldoRodriguez123/arithmetic-calculator-ui/actions/workflows/tests.yml)

Vue 3 single-page app for the
[arithmetic calculator API](https://github.com/OswaldoRodriguez123/arithmetic-calculator-api).
Users sign in with a JWT, run operations from the API catalog and review the
records each operation creates.

## Features

- **Sign in** with username and password; the JWT is stored locally and sent as
  a bearer token on every request.
- **Dashboard** with the available operations and the user's current balance.
- **New operation**: pick an operation, enter the numbers it needs and submit
  it. The API charges the operation cost and stores the result.
- **Records**: paginated table with sorting, search and soft delete.
- **Session handling**: a `401` response logs the user out and clears the
  stored token.

## Stack

- Vue 3 (Options API) + Vite
- Vue Router and Pinia
- PrimeVue (DataTable, InputText, Column)
- Axios
- Bootstrap 5 and Material Kit 2 styles
- Vitest + `@vue/test-utils` with `happy-dom`

## Getting started

Requires Node.js 18+ and a running instance of the
[API](https://github.com/OswaldoRodriguez123/arithmetic-calculator-api).

```bash
npm install
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

Vitest covers the sign-in form, the new-operation form and the records table.

## License

MIT. See [LICENSE](LICENSE).
