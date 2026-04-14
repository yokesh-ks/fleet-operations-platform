import * as fs from 'fs';
import * as path from 'path';

interface FuelReport {
  vesselCode: string;
  vesselName?: string;
}

interface VesselOutput {
  code: string;
  name: string;
  fuelEfficiencyBenchmark: number;
}

/**
 * Extracts unique vessels from fuel report files
 * Generates vessel records ready to be inserted BEFORE fuel reports
 */
function transformVessels() {
  console.log('⛴️  Extracting vessels from fuel reports...');

  const INPUT_DIR = path.join(__dirname, '..', 'output', 'fuel-report');
  const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'vessels');

  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Check if input directory exists first
    if (!fs.existsSync(INPUT_DIR)) {
      console.log('⚠️ Input directory not found: ', INPUT_DIR);
      console.log('ℹ️  Please run fuel report transformation first before extracting vessels');
      process.exit(0);
    }

    // Read all fuel report files
    const fuelFiles = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));

  if (fuelFiles.length === 0) {
    console.log('⚠️ No fuel report files found');
    return;
  }

  // Collect unique vessels
  const vesselMap = new Map<string, VesselOutput>();

  for (const file of fuelFiles) {
    const content = fs.readFileSync(path.join(INPUT_DIR, file), 'utf8');
    const records = JSON.parse(content);
    const fuelRecords = Array.isArray(records) ? records : [records];

    for (const rec of fuelRecords) {
      if (rec.vesselCode && !vesselMap.has(rec.vesselCode)) {
        vesselMap.set(rec.vesselCode, {
          code: rec.vesselCode,
          name: rec.vesselName || rec.vesselCode,
          fuelEfficiencyBenchmark: 24.5 // Default benchmark, can be adjusted later
        });
      }
    }
  }

  const vessels = Array.from(vesselMap.values());

  // Write output
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'vessels-to-insert.json'),
    JSON.stringify(vessels, null, 2)
  );

    console.log(`✅ Extracted ${vessels.length} unique vessels`);
    console.log(`📄 Output saved to: ${OUTPUT_DIR}/vessels-to-insert.json`);
    console.log('\nℹ️  This file MUST be loaded into database BEFORE loading fuel reports');
  } catch (error: any) {
    console.error('❌ Error transforming vessels:', error.message);
    if (error.code === 'ENOENT') {
      console.log('ℹ️  Missing directory or file - ensure fuel report transformation has been run first');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  transformVessels();
}

export { transformVessels };