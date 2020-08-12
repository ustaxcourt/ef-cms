const createApplicationContext = require('../src/applicationContext');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const { Message } = require('../../shared/src/business/entities/Message');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (!item.docketNumberWithSuffix) {
      const caseMessageEntity = new Message(item, { applicationContext });
      caseMessageEntity.docketNumberWithSuffix = caseMessageEntity.docketNumber;

      const caseMessage = caseMessageEntity.validate().toRawObject();
      return { ...item, ...caseMessage };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
