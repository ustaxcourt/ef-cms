/**
 * This is a convenience utility for converting an Event Code CSV from the court
 * to a JSON file that can be used by the application. It may never be used
 * again, but we've kept it in the project just in case.
 */

const fs = require('fs');
const parse = require('csv-parse');
const { gatherRecords, getCsvOptions } = require('./helpers');

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
  'trialLocation',
  'documentTitle',
];

const csvOptions = getCsvOptions(csvColumns);

/* eslint no-console: "off"*/
const main = () => {
  const data = fs.readFileSync(process.argv[2], 'utf8'); // NOSONAR this file is only used as a utility for development

  let output = [];

  const stream = parse(data, csvOptions);

  stream.on('readable', gatherRecords(exportColumns, output));
  stream.on('end', () => {
    console.log(JSON.stringify(output, null, 2));
  });
};

main();
