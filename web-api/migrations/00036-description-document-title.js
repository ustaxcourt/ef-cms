const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocketEntryRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocketEntryRecord(item) && !item.documentTitle) {
    item.documentTitle = item.description;
    delete item.description;
    const docketEntryToUpdate = new DocketEntry(
      { ...item },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, docketEntryToUpdate };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
