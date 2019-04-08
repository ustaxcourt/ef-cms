const _ = require('lodash');
const fs = require('fs');
const parse = require('csv-parse');

const USAGE = `
Usage: node generateCategories.js spreadsheet.csv > output.json
`;

const files = [];
process.argv.forEach((val, index) => {
  if (index > 1) {
    files.push(val);
  }
});

const exportColumns = [
  'documentTitle',
  'documentType',
  'category',
  'eventCode',
  'scenario',
  'labelPreviousDocument',
  'labelFreeText',
  'ordinalField',
];

const csvOptions = {
  columns: [
    'documentTitle',
    'documentType',
    'category',
    'respondent-ignore',
    'practictioner-ignore',
    'petitioner-ignore',
    'eventCode',
    'scenario',
    'labelPreviousDocument',
    'labelFreeText',
    'ordinalField',
  ],
  delimiter: ',',
  from_line: 2, // assumes first entry is header column containing labels
  relax_column_count: true,
  skip_empty_lines: true,
  trim: true,
};

const whitespaceCleanup = str => {
  str = str.replace(/\[\s+/g, '[');
  str = str.replace(/\s+\]/g, ']');
  str = str.replace(/[\r\n\t\s]+/g, ' ');
  str = str.trim();
  return str;
};

const sortableTitle = title => {
  let sortable = title.replace(/\[.*?\]/g, '').toLowerCase();
  sortable = whitespaceCleanup(sortable);
  return sortable;
};

const documentTitleSort = (a, b) => {
  const [first, second] = [
    sortableTitle(a.documentTitle),
    sortableTitle(b.documentTitle),
  ];
  const result = first.localeCompare(second, {
    ignorePunctuation: true,
    sensitivity: 'base',
  });
  return result;
};

const sortMotions = presortedMotions => {
  let sortedMotions = [];
  const firstEntries = [
    'Motion for Continuance',
    'Motion for Extension of Time',
    'Motion to Dismiss for Lack of Jurisdiction',
    'Motion to Dismiss for Lack of Prosecution',
    'Motion for Summary Judgment',
    'Motion to Change or Correct Caption',
  ];

  sortedMotions = firstEntries.map(title => {
    const [foundObj] = _.remove(presortedMotions, m => {
      return m.documentTitle.toLowerCase() === title.toLowerCase();
    });
    return foundObj;
  });

  if (sortedMotions.length !== firstEntries.length) {
    throw new Error(
      'Common motions list could not be extracted from full list of motions.',
    );
  }

  return [...sortedMotions, ...presortedMotions];
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
        sortedResult[category] = values.sort(documentTitleSort);
      });
    sortedResult['Motion'] = sortMotions(sortedResult['Motion']);
    console.log(JSON.stringify(sortedResult, null, 2));
  });
};

main();
