import 'dotenv/config';
import { runMigration, getAPIConfig, printMigrationStats, getInputDir } from '../helpers/migration-utils';

/**
 * Vessels Migration
 * Reads transformed vessels JSON from 01-transform/output/vessels
 * POSTs one record at a time to /api/vessels
 */
async function main(): Promise<void> {
  const inputDir = process.argv[2] || getInputDir('vessels');
  const config = getAPIConfig();

  const stats = await runMigration(
    'Vessel',
    inputDir,
    '/api/vessels',
    config
  );

  printMigrationStats(stats, 'Vessel');

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