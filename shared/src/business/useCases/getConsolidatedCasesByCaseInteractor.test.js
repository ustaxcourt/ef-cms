import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

describe('getConsolidatedCasesByCaseInteractor', () => {
  let applicationContext;
  let getCasesByLeadCaseIdStub;

  beforeEach(() => {
    getCasesByLeadCaseIdStub = jest.fn();

    applicationContext = {
      getPersistenceGateway: () => ({
        getCasesByLeadCaseId: getCasesByLeadCaseIdStub,
      }),
    };
  });

  it('returns cases by the leadCaseId', async () => {
    await getConsolidatedCasesByCaseInteractor({
      applicationContext,
      leadCaseId: 'leadCaseId-123',
    });

    expect(getCasesByLeadCaseIdStub).toHaveBeenCalled();
  });
});
