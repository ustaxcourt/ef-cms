const createApplicationContext = require('../src/applicationContext');
const {
  createISODateString,
} = require('../../shared/src/business/utilities/DateHandler');
const { isDocumentRecord, upGenerator } = require('./utilities');
const { isEmpty } = require('lodash');
const applicationContext = createApplicationContext({});
const {
  EXTERNAL_DOCUMENT_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');

const DEFAULT_SERVED_AT_DATE = createISODateString();
const DEFAULT_SERVED_PARTIES = [
  {
    name: 'Served via migration.',
  },
];
const DEFAULT_FILED_BY = 'Filed via migration.';

const mutateRecord = async item => {
  const bothOrNeitherServedAreDefined =
    (!item.servedAt && !item.servedParties) ||
    (item.servedAt && !isEmpty(item.servedParties));

  let result;

  if (isDocumentRecord(item)) {
    if (!bothOrNeitherServedAreDefined) {
      result = addMissingServedFieldsToDocument(item);
    }
    if (EXTERNAL_DOCUMENT_TYPES.includes((result || item).documentType)) {
      result = addMissingFiledByFieldToDocument(result || item);
    }
  }
  return result;
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

/**
 * checks for missing required servedAt and servedParties fields and updates them if necessary
 *
 * @param {object} item the document to be updated
 * @returns {Object} the updated document object
 */
function addMissingServedFieldsToDocument(item) {
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

/**
 * checks for missing required filedBy field and updates it if necessary
 *
 * @param {object} item the document to be updated
 * @returns {Object} the updated document object
 */
function addMissingFiledByFieldToDocument(item) {
  if (!item.filedBy) {
    item.filedBy = DEFAULT_FILED_BY;
  }
  const documentToUpdate = new Document({ ...item }, { applicationContext })
    .validate()
    .toRawObject();
  return { ...item, ...documentToUpdate };
}
