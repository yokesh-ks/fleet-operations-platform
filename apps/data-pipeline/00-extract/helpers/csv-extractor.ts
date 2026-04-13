import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

const CHUNK_SIZE = 250;
const MAX_FILES = 8000;

/**
 * Generate a zero-padded filename (e.g., 0001.json, 0002.json)
 */
function generateChunkFilename(index: number): string {
  return String(index + 1).padStart(4, '0') + '.json';
}

interface ExtractionConfig {
  inputPath: string;
  outputDir: string;
}

/**
 * Clean all files in the output directory
 */
function cleanOutputDir(dir: string): void {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      fs.unlinkSync(path.join(dir, file));
    }
    console.log(`Cleaned ${files.length} files from output directory`);
  }
}

/**
 * Stream CSV and write chunks to JSON files as they fill up
 */
export async function extractCsvToJson(config: ExtractionConfig): Promise<void> {
  const { inputPath, outputDir } = config;

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  // Clean output directory before writing
  cleanOutputDir(outputDir);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Reading CSV from: ${inputPath}`);
  console.log(`Max files: ${MAX_FILES}, Chunk size: ${CHUNK_SIZE}`);

  let chunk: Record<string, unknown>[] = [];
  let chunkIndex = 0;
  let totalRecords = 0;
  let filesWritten = 0;

  await new Promise<void>((resolve, reject) => {
    const writeChunk = () => {
      if (filesWritten >= MAX_FILES) {
        console.log(`Reached max files limit (${MAX_FILES}). Stopping.`);
        return false;
      }

      const filename = generateChunkFilename(chunkIndex);
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, JSON.stringify(chunk, null, 2), 'utf-8');
      console.log(`Written: ${filename} (${chunk.length} records)`);
      filesWritten++;
      chunkIndex++;
      chunk = [];
      return true;
    };

    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        if (filesWritten >= MAX_FILES) {
          return;
        }

        chunk.push(row);
        totalRecords++;

        if (chunk.length >= CHUNK_SIZE) {
          writeChunk();
        }
      })
      .on('end', () => {
        // Write remaining records
        if (chunk.length > 0 && filesWritten < MAX_FILES) {
          writeChunk();
        }
        console.log(`Total records processed: ${totalRecords}`);
        console.log(`Total files written: ${filesWritten}`);
        resolve();
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });

  console.log(`Extraction complete. Output directory: ${outputDir}`);
}
