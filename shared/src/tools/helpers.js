const _ = require('lodash');

const gatherRecords = function gatherRecords(exportColumns, output) {
  return () => {
    let record;
    while ((record = this.read())) {
      record = _.pick(record, exportColumns);
      Object.keys(record).forEach(key => {
        record[key] = whitespaceCleanup(record[key]);
      });
      output.push(record);
    }
  };
};

const getCsvOptions = (csvColumns, overrides = {}) => {
  const defaultOptions = {
    columns: csvColumns,
    delimiter: ',',
    from_line: 2, // assumes first entry is header column containing labels
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  };

  return Object.assign(defaultOptions, overrides);
};

const sortableTitle = title => {
  return whitespaceCleanup(title.toLowerCase());
};

const whitespaceCleanup = str => {
  str = str.replace(/[\r\n\t\s]+/g, ' ');
  str = str.trim();
  return str;
};

module.exports = {
  gatherRecords,
  getCsvOptions,
  sortableTitle,
  whitespaceCleanup,
};
