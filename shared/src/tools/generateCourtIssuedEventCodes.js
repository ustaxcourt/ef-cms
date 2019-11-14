/**
 * This is a convenience utility for converting an Event Code CSV from the court
 * to a JSON file that can be used by the application. It may never be used
 * again, but we've kept it in the project just in case.
 */

const _ = require('lodash');
const fs = require('fs');
const parse = require('csv-parse');

let exportColumns;
let csvColumns;

exportColumns = ['eventCode', 'documentType', 'documentTitle', 'scenario'];
csvColumns = [
  'eventCode',
  'language',
  'documentType',
  'scenario',
  'whatIsItFor',
  'judgeName',
  'date',
  'docketNumbers',
  'documentTitle',
];

const csvOptions = {
  columns: csvColumns,
  delimiter: ',',
  from_line: 2, // assumes first entry is header column containing labels
  relax_column_count: true,
  skip_empty_lines: true,
  trim: true,
};

const whitespaceCleanup = str => {
  return str.replace(/\s+/g, ' ').trim();
};

/* eslint no-console: "off"*/
const main = () => {
  const data = fs.readFileSync(process.argv[2], 'utf8');

  let output = [];

  const stream = parse(data, csvOptions);

  const gatherRecords = function gatherRecords() {
    let record;
    while ((record = this.read())) {
      record = _.pick(record, exportColumns);
      Object.keys(record).forEach(key => {
        record[key] = whitespaceCleanup(record[key]);
      });
      output.push(record);
    }
  };
  stream.on('readable', gatherRecords);
  stream.on('end', () => {
    console.log(JSON.stringify(output, null, 2));
  });
};

main();
