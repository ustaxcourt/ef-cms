import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersForConsolidatedServiceAction } from './getDocketNumbersForConsolidatedServiceAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocketNumbersForConsolidatedServiceAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return an empty list when the docket entry is multi-docketable and being filed on a non-lead case', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              { checked: true, docketNumber: MOCK_CASE.docketNumber },
              {
                checked: true,
                docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
              },
            ],
            docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          featureFlagHelper: {
            consolidatedCasesPropagateDocketEntries: true,
          },
          form: {
            eventCode: 'A',
          },
        },
      },
    );
    expect(output.docketNumbers).toEqual([]);
  });

  it('should return an empty list when the docket entry is not multi-docketable', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              { checked: true, docketNumber: MOCK_CASE.docketNumber },
              {
                checked: false,
                docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
              },
            ],
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          featureFlagHelper: {
            consolidatedCasesPropagateDocketEntries: true,
          },
          form: {
            eventCode: 'PSDE',
          },
        },
      },
    );

    expect(output.docketNumbers).toEqual([]);
  });

  it('should return the checked member case docket numbers for a multi-docketable docket entry being filed on a lead case', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              {
                checked: true,
                docketNumber: MOCK_CASE.docketNumber,
                leadDocketNumber: MOCK_CASE.docketNumber,
              },
              {
                checked: false,
                docketNumber: 'I should not show up',
                leadDocketNumber: MOCK_CASE.docketNumber,
              },
              {
                checked: true,
                docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
                leadDocketNumber: MOCK_CASE.docketNumber,
              },
            ],
            docketNumber: MOCK_CASE.docketNumber,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
          featureFlagHelper: {
            consolidatedCasesPropagateDocketEntries: true,
          },
          form: {
            eventCode: 'A',
          },
        },
      },
    );
    expect(output).toEqual({
      docketNumbers: [MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber],
    });
  });
});
