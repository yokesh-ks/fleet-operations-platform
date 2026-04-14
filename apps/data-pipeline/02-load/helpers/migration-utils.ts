import fs from 'fs/promises';
import path from 'path';

/**
 * Migration statistics tracking
 */
export interface MigrationStats {
  totalFiles: number;
  processedFiles: number;
  successfulRecords: number;
  skippedRecords: number;
  failedRecords: number;
  errors: string[];
}

/**
 * API configuration
 */
export interface APIConfig {
  baseUrl: string;
  batchSize: number;
}

/**
 * Resolves the default input directory for a data type
 */
export function getInputDir(dataType: string): string {
  return path.join(__dirname, '..', '..', '01-transform', 'output', dataType);
}

/**
 * Reads API config from env vars or defaults
 */
export function getAPIConfig(): APIConfig {
  return {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    batchSize: 1, // one record per request
  };
}

/**
 * Loads and parses JSON files from a directory, sorted numerically
 * @param inputDir - Directory containing JSON files
 * @returns Array of { filename, data } objects
 */
export async function loadJsonFiles(inputDir: string): Promise<{ name: string; data: unknown }[]> {
  const files = (await fs.readdir(inputDir))
    .filter((f) => f.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('.json', ''), 10);
      const numB = parseInt(b.replace('.json', ''), 10);
      return numA - numB;
    });

  const results: { name: string; data: unknown }[] = [];

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const content = await fs.readFile(filePath, 'utf8');
    results.push({ name: file, data: JSON.parse(content) });
  }

  return results;
}

/**
 * Flattens an array of arrays or arrays of objects into a single array
 */
export function flattenRecords(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
}

/**
 * Posts a payload to an API endpoint
 */
export async function postToAPI(endpoint: string, payload: unknown, config: APIConfig): Promise<unknown> {
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API returned ${response.status}: ${errorBody}`);
  }

  return (await response.json()) as unknown;
}

/**
 * Prints migration statistics summary
 */
export function printMigrationStats(stats: MigrationStats, label: string): void {
  console.log('\n========================================');
  console.log(`  ${label} MIGRATION SUMMARY`);
  console.log('========================================');
  console.log(`Total files:         ${stats.totalFiles}`);
  console.log(`Processed files:     ${stats.processedFiles}`);
  console.log(`Successful records:  ${stats.successfulRecords}`);
  console.log(`Skipped records:     ${stats.skippedRecords}`);
  console.log(`Failed records:      ${stats.failedRecords}`);
  console.log(`Total errors:        ${stats.errors.length}`);
  console.log('========================================');

  if (stats.errors.length > 0 && stats.errors.length <= 10) {
    console.log('\nErrors:');
    stats.errors.forEach((err) => console.log(`  - ${err}`));
  } else if (stats.errors.length > 10) {
    console.log(`\nFirst 10 errors:`);
    stats.errors.slice(0, 10).forEach((err) => console.log(`  - ${err}`));
    console.log(`  ... and ${stats.errors.length - 10} more`);
  }
  console.log('========================================\n');
}

/**
 * Generic migration runner — sends ONE record per POST call to a CRUD endpoint
 * @param dataType - Label for logging (e.g., "AIS Telemetry")
 * @param inputDir - Directory containing JSON files
 * @param apiEndpoint - CRUD POST endpoint (e.g., "/api/voyage-telemetry")
 * @param config - API configuration
 * @returns MigrationStats
 */
export async function runMigration(
  dataType: string,
  inputDir: string,
  apiEndpoint: string,
  config: APIConfig
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    totalFiles: 0,
    processedFiles: 0,
    successfulRecords: 0,
    skippedRecords: 0,
    failedRecords: 0,
    errors: [],
  };

  console.log(`Starting ${dataType} migration`);
  console.log(`API: ${config.baseUrl}${apiEndpoint}`);
  console.log(`Source: ${inputDir}`);

  const files = await loadJsonFiles(inputDir);
  stats.totalFiles = files.length;
  console.log(`Found ${files.length} files to process`);

  for (const file of files) {
    const records = flattenRecords(file.data);

    for (const record of records) {
      try {
        const response = await postToAPI(apiEndpoint, record, config);
        // If we get here (201), it was created
        stats.successfulRecords++;
      } catch (error: any) {
        const msg = error.message || '';
        if (error.message.includes('409') || error.message.includes('already exists')) {
          stats.skippedRecords++;
        } else {
          stats.failedRecords++;
          stats.errors.push(`${file.name}: ${error.message}`);
        }
      }
      stats.processedFiles++;
    }

    // Progress every 10 files
    if (stats.processedFiles % 10 === 0) {
      console.log(
        `  Progress: ${stats.processedFiles}/${files.length} files | ` +
          `Created: ${stats.successfulRecords} | Skipped: ${stats.skippedRecords} | Failed: ${stats.failedRecords}`
      );
    }
  }

  return stats;
}
