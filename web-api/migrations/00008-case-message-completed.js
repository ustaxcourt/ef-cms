const createApplicationContext = require('../src/applicationContext');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const { Message } = require('../../shared/src/business/entities/Message');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (!item.isCompleted) {
      const caseMessage = new Message({ ...item }, { applicationContext })
        .validate()
        .toRawObject();
      return { ...item, ...caseMessage };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
