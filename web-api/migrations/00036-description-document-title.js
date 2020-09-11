const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocketEntryRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocketEntryRecord(item) && !item.documentTitle) {
    const docketEntryToUpdate = new DocketEntry(
      {
        ...item,
        documentTitle: item.description,
      },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, ...docketEntryToUpdate };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
