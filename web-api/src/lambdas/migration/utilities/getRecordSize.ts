const Decimal = require('decimal.js');
const utf8 = require('utf8');

/**
 * getRecordSize
 *
 * @param {object} record a marshaled DynamoDB record to size
 * @returns {Number} the calculated size of the provided record
 */
export const getRecordSize = record => {
  let totalSize = 0;

  for (let name in record) {
    if (!record.hasOwnProperty(name)) continue;

    const attributeSize = calculateAttributeSizeInBytes(record[name]);
    const sizeOfName = utf8.encode(name).length;
    totalSize += sizeOfName + attributeSize;
  }

  return totalSize;
};

const calculateAttributeSizeInBytes = attr => {
  const BASE_LOGICAL_SIZE_OF_NESTED_TYPES = 1;
  const LOGICAL_SIZE_OF_EMPTY_DOCUMENT = 3;

  if (!attr) return 0;

  // Binary
  if (attr.hasOwnProperty('B')) {
    return Buffer.from(attr.B, 'base64').toString().length;
  }

  // String
  if (attr.hasOwnProperty('S')) {
    return utf8.encode(attr.S).length;
  }

  // Number
  if (attr.hasOwnProperty('N')) {
    return calculateNumberSizeInBytes(attr.N);
  }

  // BinarySet
  if (attr.hasOwnProperty('BS')) {
    let size = 0;

    for (let i = 0; i < attr.BS.length; i++) {
      size += Buffer.from(attr.BS[i], 'base64').toString().length;
    }

    return size;
  }

  // StringSet
  if (attr.hasOwnProperty('SS')) {
    let size = 0;

    for (let i = 0; i < attr.SS.length; i++) {
      size += utf8.encode(attr.SS[i]).length;
    }

    return size;
  }

  //  NumberSet
  if (attr.hasOwnProperty('NS')) {
    let size = 0;

    for (let i = 0; i < attr.NS.length; i++) {
      size += calculateNumberSizeInBytes(attr.NS[i]);
    }

    return size;
  }

  // Boolean
  if (attr.hasOwnProperty('BOOL')) {
    return 1;
  }

  // Null
  if (attr.hasOwnProperty('NULL')) {
    return 1;
  }

  // Map
  if (attr.hasOwnProperty('M')) {
    let size = LOGICAL_SIZE_OF_EMPTY_DOCUMENT;

    for (let name in attr.M) {
      if (!attr.M.hasOwnProperty(name)) continue;

      size += utf8.encode(name).length;
      size += calculateAttributeSizeInBytes(attr.M[name]);
      size += BASE_LOGICAL_SIZE_OF_NESTED_TYPES;
    }

    return size;
  }

  // List
  if (attr.hasOwnProperty('L')) {
    let size = LOGICAL_SIZE_OF_EMPTY_DOCUMENT;

    for (let i = 0; i < attr.L.length; i++) {
      size += calculateAttributeSizeInBytes(attr.L[i]);
      size += BASE_LOGICAL_SIZE_OF_NESTED_TYPES;
    }

    return size;
  }

  throw 'unknown data type in ' + JSON.stringify(attr);
};

const calculateNumberSizeInBytes = n => {
  let decimal = new Decimal(n);
  if (decimal.isZero()) return 1;
  let fixed = decimal.toFixed();
  let size = measure(fixed.replace('-', '')) + 1;
  if (fixed.startsWith('-')) size++;
  if (size > 21) size = 21;
  return size;
};

const measure = n => {
  if (n.indexOf('.') !== -1) {
    let parts = n.split('.');
    let p0 = parts[0];
    let p1 = parts[1];
    if (p0 === '0') {
      p0 = '';
      p1 = zeros(p1, true, undefined);
    }
    if (p0.length % 2 !== 0) p0 = 'Z' + p0;
    if (p1.length % 2 !== 0) p1 = p1 + 'Z';
    return measure(p0 + p1);
  }
  n = zeros(n, true, true);
  return Math.ceil(n.length / 2);
};

const zeros = (n, left, right) => {
  while (left && true) {
    let t = n.replace(/^(0{2})/, '');
    if (t.length == n.length) break;
    n = t;
  }
  while (right && true) {
    let t = n.replace(/(0{2})$/, '');
    if (t.length == n.length) break;
    n = t;
  }
  return n;
};
