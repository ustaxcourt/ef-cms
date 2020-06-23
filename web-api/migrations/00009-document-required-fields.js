const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const { isEmpty } = require('lodash');
const applicationContext = createApplicationContext({});
const { Document } = require('../../shared/src/business/entities/Document');

const DEFAULT_SERVED_AT_DATE = new Date().toISOString();
const DEFAULT_SERVED_PARTIES = [
  {
    name: 'Served via migration.',
  },
];

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    if (
      (!item.servedAt && !item.servedParties) ||
      (item.servedAt && !isEmpty(item.servedParties))
    ) {
      return;
    }
    return addMissingFieldsToDocument(item);
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

/**
 * checks for missing required fields and updates them if necessary
 *
 * @param {object} item the document to be updated
 * @returns {Object} the updated document object
 */
function addMissingFieldsToDocument(item) {
  if (!item.servedAt) {
    item.servedAt = DEFAULT_SERVED_AT_DATE;
  }
  if (isEmpty(item.servedParties)) {
    item.servedParties = DEFAULT_SERVED_PARTIES;
  }
  const documentToUpdate = new Document({ ...item }, { applicationContext })
    .validate()
    .toRawObject();
  return { ...item, ...documentToUpdate };
}
