const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateStandingPretrialOrderInteractor,
} = require('./generateStandingPretrialOrderInteractor');

describe('generateStandingPretrialOrderInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '123-45',
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '234-56',
            docketNumberSuffix: 'S',
          };
        }
      });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(() => ({
        address1: '123 Some Street',
        address2: 'Courtroom 2',
        city: 'City',
        courthouseName: 'Courthouse 1',
        judge: 'Test Judge',
        postalCode: '12345',
        startDate: '2/2/2020',
        startTime: '10:00',
        state: 'AL',
      }));
  });

  it('get the case detail and trial session detail', async () => {
    await generateStandingPretrialOrderInteractor({
      applicationContext,
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should call the Standing Pretrial Order document generator', async () => {
    await generateStandingPretrialOrderInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });
    expect(
      applicationContext.getDocumentGenerators().standingPretrialOrder,
    ).toHaveBeenCalled();
  });

  it('should add a served stamp to the document', async () => {
    await generateStandingPretrialOrderInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });
    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument,
    ).toHaveBeenCalled();
  });
});
