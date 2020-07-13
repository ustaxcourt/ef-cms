const createApplicationContext = require('../src/applicationContext');
const {
  CaseMessage,
} = require('../../shared/src/business/entities/CaseMessage');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (!item.parentMessageId) {
      const caseMessage = new CaseMessage(
        {
          ...item,
          parentMessageId: item.messageId,
        },
        { applicationContext },
      )
        .validate()
        .toRawObject();
      return { ...item, ...caseMessage };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
