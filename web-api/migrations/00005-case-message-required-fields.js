const createApplicationContext = require('../src/applicationContext');
const {
  CaseMessage,
} = require('../../shared/src/business/entities/CaseMessage');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (!item.caseStatus || !item.caseTitle) {
      const {
        caseCaption,
        status,
      } = await applicationContext
        .getPersistenceGateway()
        .getCaseByCaseId({ applicationContext, caseId: item.caseId });

      const caseTitle = applicationContext.getCaseTitle(caseCaption);

      const messageAfter = {
        ...item,
        caseStatus: status,
        caseTitle,
      };

      const caseMessageEntity = new CaseMessage(messageAfter, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      return { ...item, ...caseMessageEntity };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
