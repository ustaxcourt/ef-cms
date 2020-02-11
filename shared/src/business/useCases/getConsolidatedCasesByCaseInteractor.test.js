const {
  getConsolidatedCasesByCaseInteractor,
} = require('./getConsolidatedCasesByCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');

describe('getConsolidatedCasesByCaseInteractor', () => {
  let applicationContext;
  let getCasesByLeadCaseIdStub;

  beforeEach(() => {
    getCasesByLeadCaseIdStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        caseId: 'a0af9894-0390-463c-bf17-aae52c34c026',
      },
      {
        ...MOCK_CASE,
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        caseId: '976e0e9d-ffa7-4d56-ac6f-aea848a5dba1',
      },
    ]);

    applicationContext = {
      getPersistenceGateway: () => ({
        getCasesByLeadCaseId: getCasesByLeadCaseIdStub,
      }),
    };
  });

  it('returns cases by the leadCaseId', async () => {
    const cases = await getConsolidatedCasesByCaseInteractor({
      applicationContext,
      leadCaseId: 'leadCaseId-123',
    });

    expect(getCasesByLeadCaseIdStub).toHaveBeenCalled();
    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        caseId: 'a0af9894-0390-463c-bf17-aae52c34c026',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        caseId: '976e0e9d-ffa7-4d56-ac6f-aea848a5dba1',
      },
    ]);
  });
});
