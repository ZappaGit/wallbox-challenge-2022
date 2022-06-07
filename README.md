[![Node.js CI](https://github.com/ZappaGit/wallbox-challenge-2022/actions/workflows/integration.yml/badge.svg)](https://github.com/ZappaGit/wallbox-challenge-2022/actions/workflows/integration.yml)
[![Node.js CI](https://github.com/ZappaGit/wallbox-challenge-2022/actions/workflows/e2e.yml/badge.svg)](https://github.com/ZappaGit/wallbox-challenge-2022/actions/workflows/e2e.yml)

# Wallbox-challenge-2022

## How run tests.

You need the following software:

- node (preferred LTS version)
- npm

Install depencies:

```bash
npm install
```

And just start the application with npm:

```bash
npm start
```

run Integration tests

```bash
npm run tests:i
```

run E2E tests

```bash
npm run tests:e2e
```

run individual Integration test

```bash
npm run test:i --args "<testName>"
```

run individual E2E test

```bash
npm run test:e2e --args "<testName>"
```

## Check results report

Use your Live Server in path `./tests/{E2E|Integration}/reports/mochawesome `

## Postman file

Use your Postman client to import file `./tests/postman/wallbox.postman_collection.json`
