import * as path from 'path';
import { extractCsvToJson } from '../helpers/csv-extractor';

async function main() {
  const inputPath = path.join(__dirname, '..', '..', '..', '..', 'data', 'AIS_2022_03_31.csv');
  const outputDir = path.join(__dirname, '..', 'output', 'ais');

  try {
    await extractCsvToJson({ inputPath, outputDir });
  } catch (error) {
    console.error('Extraction failed:', error);
    process.exit(1);
  }
}

main();
