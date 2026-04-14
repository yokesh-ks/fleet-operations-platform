import path from 'path';
import { mapFields, coerceNumericFields, validateAgainstSchema, loadConfig, processFiles } from '../helpers/transform-utils';

// Read field mapping configuration
const fieldMapping = loadConfig('../config/port-performance/field-mapping.json');
const targetSchema = loadConfig('../config/port-performance/target-schema.json');

/**
 * Transforms port performance JSON data to match target schema
 * @param inputData - Raw port performance JSON data
 * @returns Transformed data matching target schema
 */
function transformPortPerformanceData(inputData: any): any {
  const mapped = mapFields(inputData, fieldMapping);
  const transformed = coerceNumericFields(mapped, targetSchema);

  // Validate against target schema
  validateAgainstSchema(transformed, targetSchema);

  return transformed;
}

/**
 * Main transformation function
 * @param inputDir - Directory containing raw port performance JSON files
 * @param outputDir - Directory to save transformed JSON files
 */
async function transformPortPerformance(inputDir: string, outputDir: string): Promise<void> {
  await processFiles(inputDir, outputDir, transformPortPerformanceData, 'Port performance');
}

// If run directly, use default directories
if (require.main === module) {
  const inputDir = path.join(__dirname, '..', '..', '00-extract/output/port-performance');
  const outputDir = path.join(__dirname, '..', 'output/port-performance');
  transformPortPerformance(inputDir, outputDir);
}

export { transformPortPerformanceData, transformPortPerformance }; 