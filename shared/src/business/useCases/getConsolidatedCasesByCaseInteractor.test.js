import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

describe('getConsolidatedCasesByCaseInteractor', () => {
  let applicationContext;
  let getCasesByLeadCaseIdStub;

  beforeEach(() => {
    getCasesByLeadCaseIdStub = jest.fn().mockResolvedValue([
      { caseCaption: 'Guy Fieri vs. Bobby Flay', caseId: 'abc-123' },
      { caseCaption: 'Guy Fieri vs. Gordon Ramsay', caseId: 'def-321' },
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
    expect(cases).toEqual([
      { caseCaption: 'Guy Fieri vs. Bobby Flay', caseId: 'abc-123' },
      { caseCaption: 'Guy Fieri vs. Gordon Ramsay', caseId: 'def-321' },
    ]);
  });
});
