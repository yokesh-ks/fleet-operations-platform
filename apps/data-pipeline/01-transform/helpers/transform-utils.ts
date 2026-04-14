import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * Schema field definition interface
 */
interface FieldSchema {
  type: string;
  required?: boolean;
  minimum?: number;
  maximum?: number;
}

/**
 * Maps fields from source data to target structure based on field mapping configuration
 * @param inputData - Raw input JSON data
 * @param fieldMapping - Field mapping configuration object (source -> target)
 * @returns Mapped data object
 */
export function mapFields(inputData: any, fieldMapping: Record<string, string>): any {
  const transformed: any = {};

  for (const [sourceField, targetField] of Object.entries(fieldMapping)) {
    if (inputData[sourceField] !== undefined) {
      transformed[targetField] = inputData[sourceField];
    }
  }

  return transformed;
}

/**
 * Validates data against target schema definition
 * @param data - Data to validate
 * @param schema - Target schema definition
 * @throws Error if validation fails
 */
export function validateAgainstSchema(data: any, schema: Record<string, FieldSchema>): void {
  for (const [field, fieldSchema] of Object.entries(schema)) {
    if (fieldSchema.required && data[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }

    if (data[field] !== undefined) {
      const actualType = typeof data[field];
      const expectedType = fieldSchema.type;

      if (expectedType === 'number' && actualType !== 'number') {
        throw new Error(`Field ${field} should be number, got ${actualType}`);
      }

      if (expectedType === 'string' && actualType !== 'string') {
        throw new Error(`Field ${field} should be string, got ${actualType}`);
      }

      if (expectedType === 'number' && fieldSchema.minimum !== undefined && data[field] < fieldSchema.minimum) {
        throw new Error(`Field ${field} should be >= ${fieldSchema.minimum}`);
      }

      if (expectedType === 'number' && fieldSchema.maximum !== undefined && data[field] > fieldSchema.maximum) {
        throw new Error(`Field ${field} should be <= ${fieldSchema.maximum}`);
      }
    }
  }
}

/**
 * Loads JSON configuration file synchronously
 * @param configPath - Relative path to the JSON config file (relative to scripts directory)
 * @returns Parsed JSON content
 */
export function loadConfig(configPath: string): any {
  return require(configPath);
}

/**
 * Processes all JSON files in a directory through a transformation function
 * @param inputDir - Directory containing raw JSON files
 * @param outputDir - Directory to save transformed JSON files
 * @param transformFn - Transformation function to apply to each file
 * @param dataTypeName - Name of the data type for logging (e.g., "AIS", "fuel report")
 */
export async function processFiles(
  inputDir: string,
  outputDir: string,
  transformFn: (data: any) => any,
  dataTypeName: string
): Promise<void> {
  try {
    const files = await fsPromises.readdir(inputDir);
    console.log(`Found ${files.length} ${dataTypeName} files to process`);

    for (const file of files) {
      try {
        const filePath = path.join(inputDir, file);
        const fileContent = await fsPromises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const transformedData = transformFn(jsonData);

        const outputPath = path.join(outputDir, file);
        await fsPromises.writeFile(outputPath, JSON.stringify(transformedData, null, 2));

        console.log(`Transformed ${file} successfully`);
      } catch (error: any) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    console.log(`${dataTypeName} transformation completed`);
  } catch (error: any) {
    console.error(`Error in ${dataTypeName} transformation:`, error.message);
  }
}
