import 'dotenv/config';
import { runMigration, getAPIConfig, printMigrationStats, getInputDir } from '../helpers/migration-utils';

/**
 * AIS Telemetry Migration
 * Reads transformed AIS JSON from 01-transform/output/ais
 * POSTs one record at a time to /api/voyage-telemetry
 */
async function main(): Promise<void> {
  const inputDir = process.argv[2] || getInputDir('ais');
  const config = getAPIConfig();

  const stats = await runMigration(
    'AIS Telemetry',
    inputDir,
    '/api/voyage-telemetry',
    config
  );

  printMigrationStats(stats, 'AIS Telemetry');

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
