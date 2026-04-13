import * as path from 'path';
import { extractCsvToJson } from '../helpers/csv-extractor';

async function main() {
  const inputPath = path.join(__dirname, '..', '..', '..', '..', 'data', 'ship_fuel_efficiency.csv');
  const outputDir = path.join(__dirname, '..', 'output', 'fuel-efficiency');

  try {
    await extractCsvToJson({ inputPath, outputDir });
  } catch (error) {
    console.error('Extraction failed:', error);
    process.exit(1);
  }
}

main();
