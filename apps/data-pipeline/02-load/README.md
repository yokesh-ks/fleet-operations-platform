# 02-load - Data Migration Scripts

Loads transformed data into the database **via the API's CRUD endpoints**.

## Architecture

```
02-load (HTTP POST one record) → API CRUD (/api/*) → Prisma → PostgreSQL
```

No direct database access. Each migration script reads JSON files and POSTs one record at a time to the API's standard CRUD create endpoints.

## Structure

```
02-load/
├── helpers/
│   └── migration-utils.ts    # Shared: runMigration(), loadJsonFiles(), postToAPI()
├── scripts/
│   ├── migrate-ais.ts              # POSTs to /api/voyage-telemetry
│   ├── migrate-fuel-report.ts      # POSTs to /api/fuel-reports
│   └── migrate-port-performance.ts # POSTs to /api/port-benchmarks
└── README.md
```

## Prerequisites

- API application running (`cd apps/api && pnpm dev`)
- PostgreSQL running (via Docker Compose)
- Transformed output from `01-transform/output/`

## Usage

```bash
pnpm migrate:ais
pnpm migrate:fuel-report
pnpm migrate:port-performance

# Custom input dir
pnpm migrate:ais /path/to/ais/output
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://localhost:8000` | URL of the running API |

## API CRUD Endpoints Consumed

| Migration | Endpoint | Method |
|-----------|----------|--------|
| AIS Telemetry | `POST /api/voyage-telemetry` | Create |
| Fuel Report | `POST /api/fuel-reports` | Create |
| Port Benchmark | `POST /api/port-benchmarks` | Create |

Each API resource has full CRUD: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
