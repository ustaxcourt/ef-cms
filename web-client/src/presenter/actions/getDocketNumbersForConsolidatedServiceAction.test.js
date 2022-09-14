import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocketNumbersForConsolidatedServiceAction } from './getDocketNumbersForConsolidatedServiceAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocketNumbersForConsolidatedServiceAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should only return the non-lead docketNumber for a multi-docketable document on a non-lead case', async () => {
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
    expect(output).toEqual({
      docketNumbers: [MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber],
    });
  });
});
