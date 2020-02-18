const createApplicationContext = require('../src/applicationContext');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../shared/src/business/entities/cases/CaseConstants');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item) && item.respondents) {
    item.respondents.forEach(respondent => {
      if (!respondent.serviceIndicator) {
        respondent.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    });

    const caseEntity = new Case(item, { applicationContext })
      .validate()
      .toRawObject();

    const itemToPut = {
      ...item,
      ...caseEntity,
    };
    return itemToPut;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
