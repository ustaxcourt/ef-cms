import { getConsolidatedCasesByCaseAction } from './getConsolidatedCasesByCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByCaseAction', () => {
  let getConsolidatedCasesByCaseInteractorStub;

  beforeEach(() => {
    getConsolidatedCasesByCaseInteractorStub = jest.fn().mockReturnValue([
      {
        caseId: 'case-id-234',
        createdAt: '2019-07-20T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-123',
        createdAt: '2019-07-19T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-345',
        createdAt: '2019-07-21T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getConsolidatedCasesByCaseInteractor: getConsolidatedCasesByCaseInteractorStub,
      }),
    };
  });

  it("gets the consolidated cases by the case's lead case", async () => {
    const { state } = await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadCaseId: 'case-id-123',
        },
      },
    });

    expect(getConsolidatedCasesByCaseInteractorStub).toHaveBeenCalled();
    expect(state.caseDetail.consolidatedCases).toEqual([
      {
        caseId: 'case-id-123',
        createdAt: '2019-07-19T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-234',
        createdAt: '2019-07-20T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-345',
        createdAt: '2019-07-21T20:20:15.680Z',
        leadCaseId: 'case-id-123',
      },
    ]);
  });

  it('does not try to retrieve consolidated cases if it has no lead case', async () => {
    await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadCaseId: 'case-id-123',
        },
      },
    });

    expect(getConsolidatedCasesByCaseInteractorStub).not.toHaveBeenCalled();
  });
});
