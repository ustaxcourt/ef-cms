const createApplicationContext = require('../src/applicationContext');
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

      return { ...item, caseStatus: status, caseTitle };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
