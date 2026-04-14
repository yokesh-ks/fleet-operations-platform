import 'dotenv/config';
import { runMigration, getAPIConfig, printMigrationStats, getInputDir } from '../helpers/migration-utils';

/**
 * Port Benchmark Migration
 * Reads transformed port performance JSON from 01-transform/output/port-performance
 * POSTs one record at a time to /api/port-benchmarks
 */
async function main(): Promise<void> {
  const inputDir = process.argv[2] || getInputDir('port-performance');
  const config = getAPIConfig();

  const stats = await runMigration(
    'Port Benchmark',
    inputDir,
    '/api/port-benchmarks',
    config
  );

  printMigrationStats(stats, 'Port Benchmark');

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
