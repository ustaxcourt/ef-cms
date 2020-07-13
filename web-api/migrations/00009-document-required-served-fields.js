const createApplicationContext = require('../src/applicationContext');
const {
  createISODateString,
} = require('../../shared/src/business/utilities/DateHandler');
const { isDocumentRecord, upGenerator } = require('./utilities');
const { isEmpty } = require('lodash');
const applicationContext = createApplicationContext({});
const { Document } = require('../../shared/src/business/entities/Document');

const DEFAULT_SERVED_AT_DATE = createISODateString();
const DEFAULT_SERVED_PARTIES = [
  {
    name: 'Served via migration.',
  },
];

const mutateRecord = async item => {
  const servedPropertiesComplete =
    (!item.servedAt && !item.servedParties) ||
    (item.servedAt && !isEmpty(item.servedParties));

  if (isDocumentRecord(item)) {
    if (!servedPropertiesComplete) {
      const documentToUpdate = new Document(
        {
          ...item,
          servedAt: item.servedAt || DEFAULT_SERVED_AT_DATE,
          servedParties: item.servedParties || DEFAULT_SERVED_PARTIES,
        },
        { applicationContext },
      )
        .validate()
        .toRawObject();
      return { ...item, ...documentToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
