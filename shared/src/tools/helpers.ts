const { pick } = require('lodash');

const gatherRecords = function gatherRecords(exportColumns, output) {
  return function () {
    let record;
    while ((record = this.read())) {
      record = pick(record, exportColumns);
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

/**
 * Returns a promise that resolves itself after the specified number of milliseconds
 *
 * @param {number} ms The number of milliseconds to wait before resolving the promise
 * @returns {Promise} resolves itself after the specified number of ms
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * To improve the success rate of retry attempts, this function is available to
 * pause the application before attempting to retry a failed operation with AWS.
 * The higher the retryCount, the longer we wait.
 *
 * @param {number} retryCount how many times we have retried this task
 * @returns {Promise} resolves once the sleep timeout has elapsed
 */
const backOff = retryCount => sleep(Math.pow(2, retryCount) * 100);

module.exports = {
  backOff,
  gatherRecords,
  getCsvOptions,
  sleep,
  sortableTitle,
  whitespaceCleanup,
};
