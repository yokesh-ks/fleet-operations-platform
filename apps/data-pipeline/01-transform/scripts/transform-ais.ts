import path from 'path';
import { mapFields, validateAgainstSchema, loadConfig, processFiles } from '../helpers/transform-utils';

// Read field mapping configuration
const fieldMapping = loadConfig('../config/ais/field-mapping.json');
const targetSchema = loadConfig('../config/ais/target-schema.json');

/**
 * Transforms AIS JSON data to match target schema
 * @param inputData - Raw AIS JSON data
 * @returns Transformed data matching target schema
 */
function transformAISData(inputData: any): any {
  const transformed = mapFields(inputData, fieldMapping);

  // Validate against target schema
  validateAgainstSchema(transformed, targetSchema);

  return transformed;
}

/**
 * Main transformation function
 * @param inputDir - Directory containing raw AIS JSON files
 * @param outputDir - Directory to save transformed JSON files
 */
async function transformAIS(inputDir: string, outputDir: string): Promise<void> {
  await processFiles(inputDir, outputDir, transformAISData, 'AIS');
}

// If run directly, use default directories
if (require.main === module) {
  const inputDir = path.join(__dirname, '..', '00-extract/output/ais');
  const outputDir = path.join(__dirname, '..', 'output/ais');
  transformAIS(inputDir, outputDir);
}

export { transformAISData, transformAIS };