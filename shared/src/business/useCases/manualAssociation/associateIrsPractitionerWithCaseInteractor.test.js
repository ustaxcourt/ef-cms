const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  associateIrsPractitionerWithCaseInteractor,
} = require('./associateIrsPractitionerWithCaseInteractor');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/cases/CaseConstants');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('associateIrsPractitionerWithCaseInteractor', () => {
  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    docketNumber: '123-19',
    docketRecord: MOCK_CASE.docketRecord,
    documents: MOCK_CASE.documents,
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  it('should throw an error when not authorized', async () => {
    await associateIrsPractitionerWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    }).rejects.toThrow('Unauthorized');
  });

  it('should add mapping for an irsPractitioner', async () => {
    await associateIrsPractitionerWithCaseInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
