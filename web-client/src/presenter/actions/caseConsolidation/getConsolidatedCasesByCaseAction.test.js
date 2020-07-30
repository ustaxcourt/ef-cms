import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getConsolidatedCasesByCaseAction } from './getConsolidatedCasesByCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByCaseAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor.mockResolvedValue([
        {
          docketNumber: '100-19',
          leadDocketNumber: '100-19',
        },
        {
          docketNumber: '102-19',
          leadDocketNumber: '100-19',
        },
        {
          docketNumber: '111-19',
          leadDocketNumber: '100-19',
        },
      ]);

    presenter.providers.applicationContext = applicationContext;
  });

  it("gets the consolidated cases by the case's lead case", async () => {
    const { output } = await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadDocketNumber: '100-19',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(output.consolidatedCases).toEqual([
      {
        docketNumber: '100-19',
        leadDocketNumber: '100-19',
      },
      {
        docketNumber: '102-19',
        leadDocketNumber: '100-19',
      },
      {
        docketNumber: '111-19',
        leadDocketNumber: '100-19',
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

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls.length,
    ).toEqual(0);
  });
});
