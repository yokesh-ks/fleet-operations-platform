import 'dotenv/config';
import { runMigration, getAPIConfig, printMigrationStats, getInputDir } from '../helpers/migration-utils';

/**
 * Fuel Report Migration
 * Reads transformed fuel report JSON from 01-transform/output/fuel-report
 * POSTs one record at a time to /api/fuel-reports
 */
async function main(): Promise<void> {
  const inputDir = process.argv[2] || getInputDir('fuel-report');
  const config = getAPIConfig();

  const stats = await runMigration(
    'Fuel Report',
    inputDir,
    '/api/fuel-reports',
    config
  );

  printMigrationStats(stats, 'Fuel Report');

  if (stats.failedRecords > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}
