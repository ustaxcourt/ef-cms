const fs = require('fs');
const parse = require('csv-parse');
const _ = require('lodash');

const USAGE = `
Usage: node generateCategories.js spreadsheet.csv > output.json
`;

const files = [];
process.argv.forEach((val, index) => {
  if (index > 1) {
    files.push(val);
  }
});

const csvOptions = {
  columns: [
    'documentTitle',
    'eventCode',
    'categoryCurrent',
    'categoryUpdated',
    'scenario',
    'label-previous',
    'label-free',
    'ordinal-field',
    'extra',
  ],
  delimiter: ',',
  from_line: 2, // assumes first entry is header column containing labels
  relax_column_count: true,
  skip_empty_lines: true,
  trim: true,
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
    const [foundObj] = _.remove(
      presortedMotions,
      m => m.documentTitle.toLowerCase() === title.toLowerCase(),
    );
    return foundObj;
  });
  return [...sortedMotions, ...presortedMotions];
};

const whitespaceCleanup = str => {
  str = str.replace(/\[\s+/g, '[');
  str = str.replace(/\s+\]/g, ']');
  str = str.replace(/[\r\n\t]/g, ' ');
  str = str.replace(/\s+/g, ' ');
  str = str.trim();
  return str;
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
      Object.keys(record).forEach(key => {
        record[key] = whitespaceCleanup(record[key]);
      });
      output.push(record);
    }
  };
  stream.on('readable', gatherRecords);
  stream.on('end', () => {
    output.forEach(el => {
      if (el.categoryUpdated.length === 0) {
        return;
      }
      if (!result[el.categoryUpdated]) {
        result[el.categoryUpdated] = [];
      }
      result[el.categoryUpdated].push(el);
    });
    Object.keys(result)
      .sort()
      .forEach(category => {
        let values = result[category];
        sortedResult[category] = values.sort((a, b) => {
          return a.documentTitle.localeCompare(b.documentTitle, {
            ignorePunctuation: true,
            sensitivity: 'base',
          });
        });
      });
    sortedResult['Motion'] = sortMotions(sortedResult['Motion']);
    console.log(JSON.stringify(sortedResult, null, 2));
  });
};

main();
