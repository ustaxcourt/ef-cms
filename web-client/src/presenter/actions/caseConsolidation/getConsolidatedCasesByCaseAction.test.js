import { applicationContext } from '../../../applicationContext';
import { getConsolidatedCasesByCaseAction } from './getConsolidatedCasesByCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByCaseAction', () => {
  let getConsolidatedCasesByCaseInteractorStub;

  beforeEach(() => {
    getConsolidatedCasesByCaseInteractorStub = jest.fn().mockReturnValue([
      {
        caseId: 'case-id-123',
        docketNumber: '100-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-234',
        docketNumber: '102-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-345',
        docketNumber: '111-19',
        leadCaseId: 'case-id-123',
      },
    ]);

    presenter.providers.applicationContext = {
      getEntityConstructors: applicationContext.getEntityConstructors,
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

    expect();
    expect(getConsolidatedCasesByCaseInteractorStub).toHaveBeenCalled();
    expect(state.caseDetail.consolidatedCases).toEqual([
      {
        caseId: 'case-id-123',
        docketNumber: '100-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-234',
        docketNumber: '102-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-345',
        docketNumber: '111-19',
        leadCaseId: 'case-id-123',
      },
    ]);
  });

  it('does not try to retrieve consolidated cases if it has no lead case', async () => {
    await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
      },
    });

    expect(getConsolidatedCasesByCaseInteractorStub).not.toHaveBeenCalled();
  });
});
