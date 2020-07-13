const createApplicationContext = require('../src/applicationContext');
const {
  CaseMessage,
} = require('../../shared/src/business/entities/CaseMessage');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (!item.docketNumberWithSuffix) {
      const caseMessageEntity = new CaseMessage(item, { applicationContext });
      caseMessageEntity.docketNumberWithSuffix = caseMessageEntity.docketNumber;

      const caseMessage = caseMessageEntity.validate().toRawObject();
      return { ...item, ...caseMessage };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
