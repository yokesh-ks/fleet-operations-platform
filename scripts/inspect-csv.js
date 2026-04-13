const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const FILE_PATH = path.resolve(
  __dirname,
  '../data/ship_fuel_efficiency.csv'
);

const rows = [];
let headers = [];

fs.createReadStream(FILE_PATH)
  .pipe(csv())
  .on('headers', (parsedHeaders) => {
    headers = parsedHeaders;
  })
  .on('data', (row) => {
    if (rows.length < 5) rows.push(row);
  })
  .on('end', () => {
    console.log('\n=== CSV INSPECTION REPORT ===');
    console.log('\nHeaders:');
    console.table(headers);

    console.log('\nSample Rows:');
    console.table(rows);
  })
  .on('error', (err) => {
    console.error('CSV Parse Error:', err);
  });