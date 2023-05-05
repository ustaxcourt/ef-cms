/**
 * This is a convenience utility for converting an Event Code CSV from the court
 * to a JSON file that can be used by the application. It may never be used
 * again, but we've kept it in the project just in case.
 */

import { gatherRecords, getCsvOptions, sortableTitle } from './helpers';
import { parse } from 'csv-parse';
import { remove } from 'lodash';
import fs from 'fs';

const USAGE = `
Usage: node generateCategories.js [internal/external] spreadsheet.csv > output.json
`;

const type = process.argv[2];

const files = [];
process.argv.forEach((val, index) => {
  if (index > 2) {
    files.push(val);
  }
});

let exportColumns;
let csvColumns;
if (type === 'internal') {
  exportColumns = [
    'documentTitle',
    'documentType',
    'category',
    'eventCode',
    'scenario',
    'labelPreviousDocument',
    'labelFreeText',
    'labelFreeText2',
    'ordinalField',
  ];
  csvColumns = [
    'documentTitle',
    'documentType',
    'category',
    'respondent-ignore',
    'practitioner-ignore',
    'petitioner-ignore',
    'eventCode',
    'scenario',
    'variations-ignore',
    'labelPreviousDocument',
    'labelFreeText',
    'labelFreeText2',
    'ordinalField',
  ];
} else if (type === 'external') {
  exportColumns = [
    'documentTitle',
    'documentType',
    'category',
    'eventCode',
    'scenario',
    'labelPreviousDocument',
    'labelFreeText',
    'ordinalField',
  ];
  csvColumns = [
    'documentTitle',
    'documentType',
    'category',
    'respondent-ignore',
    'practitioner-ignore',
    'petitioner-ignore',
    'eventCode',
    'scenario',
    'labelPreviousDocument',
    'labelFreeText',
    'ordinalField',
  ];
}

const csvOptions = getCsvOptions(csvColumns);

const documentTypeSort = (a, b) => {
  const [first, second] = [
    sortableTitle(a.documentType),
    sortableTitle(b.documentType),
  ];
  const result = first.localeCompare(second, {
    ignorePunctuation: true,
    sensitivity: 'base',
  });
  return result;
};

const presorted = {
  Motion: [
    'Motion for Continuance',
    'Motion for Extension of Time',
    'Motion to Dismiss for Lack of Jurisdiction',
    'Motion to Dismiss for Lack of Prosecution',
    'Motion for Summary Judgment',
    'Motion to Change or Correct Caption',
  ],
};

const presortCategory = (sortedCategory, categoryName) => {
  let firstEntries = presorted[categoryName];
  if (!firstEntries) {
    return sortedCategory;
  }
  let resortedEntries = [];

  resortedEntries = firstEntries.map(title => {
    const [foundObj] = remove(sortedCategory, m => {
      return m.documentTitle.toLowerCase() === title.toLowerCase();
    });
    return foundObj;
  });

  if (resortedEntries.length !== firstEntries.length) {
    throw new Error('Pre-sorted items could not be extracted.');
  }

  return [...resortedEntries, ...sortedCategory];
};

/* eslint no-console: "off"*/
const main = () => {
  if (files.length < 1) {
    console.log(USAGE);
    return;
  }
  const data = fs.readFileSync(files[0], 'utf8');

  let output = [];
  let result = {};
  let sortedResult = {};

  const stream = parse(data, csvOptions);

  stream.on('readable', gatherRecords(exportColumns, output));
  stream.on('end', () => {
    output.forEach(el => {
      if (el.category.length === 0) {
        return;
      }
      if (!result[el.category]) {
        result[el.category] = [];
      }
      result[el.category].push(el);
    });
    Object.keys(result)
      .sort()
      .forEach(category => {
        let values = result[category];
        sortedResult[category] = presortCategory(
          values.sort(documentTypeSort),
          category,
        );
      });

    console.log(JSON.stringify(sortedResult, null, 2));
  });
};

main();
