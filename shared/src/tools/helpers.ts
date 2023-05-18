import { pick } from 'lodash';

export const gatherRecords = function gatherRecords(exportColumns, output) {
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

export const getCsvOptions = (csvColumns, overrides = {}) => {
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

export const sortableTitle = title => {
  return whitespaceCleanup(title.toLowerCase());
};

export const whitespaceCleanup = str => {
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
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * To improve the success rate of retry attempts, this function is available to
 * pause the application before attempting to retry a failed operation with AWS.
 * The higher the retryCount, the longer we wait.
 *
 * @param {number} retryCount how many times we have retried this task
 * @returns {Promise} resolves once the sleep timeout has elapsed
 */
export const backOff = retryCount => sleep(Math.pow(2, retryCount) * 100);
