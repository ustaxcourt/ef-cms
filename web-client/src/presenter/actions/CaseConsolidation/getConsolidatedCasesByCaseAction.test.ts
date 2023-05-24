import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getConsolidatedCasesByCaseAction } from './getConsolidatedCasesByCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByCaseAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should NOT retrieve consolidated cases when the case is NOT consolidated', async () => {
    await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadDocketNumber: undefined,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls.length,
    ).toEqual(0);
  });

  it("should retrieve consolidated cases, picking out fields specified by the ConsolidatedCaseDTO, using the case's lead docket number", async () => {
    const mockLeadDocketNumber = '100-19';
    const mockConsolidatedCases = [
      {
        docketNumber: '100-19',
        leadDocketNumber: mockLeadDocketNumber,
      },
      {
        docketNumber: '102-19',
        leadDocketNumber: mockLeadDocketNumber,
      },
      {
        docketNumber: '111-19',
        leadDocketNumber: mockLeadDocketNumber,
      },
    ];
    applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor.mockResolvedValue(
        mockConsolidatedCases,
      );

    const { output } = await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadDocketNumber: mockLeadDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls[0][1],
    ).toEqual({
      docketNumber: mockLeadDocketNumber,
      pickFields: [
        'caseCaption',
        'docketNumber',
        'docketNumberWithSuffix',
        'entityName',
        'irsPractitioners',
        'leadDocketNumber',
        'isSealed',
        'petitioners',
        'privatePractitioners',
      ],
    });
    expect(output.consolidatedCases).toEqual(mockConsolidatedCases);
  });
});
