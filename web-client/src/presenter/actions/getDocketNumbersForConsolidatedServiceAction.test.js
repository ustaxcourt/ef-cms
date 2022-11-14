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

  it('should ONLY return the lead docketNumber for a NON multi-docketable document on a lead case', async () => {
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
    expect(output).toEqual({
      docketNumbers: [MOCK_CASE.docketNumber],
    });
  });

  it('should ONLY return the lead docketNumber for a multi-docketable document on a lead case where only the lead case is checked', async () => {
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
            eventCode: 'A',
          },
        },
      },
    );
    expect(output).toEqual({
      docketNumbers: [MOCK_CASE.docketNumber],
    });
  });

  it('should ONLY return the lead docketNumber for a multi-docketable document on a case when the case has no consolidatedCases associated with it', async () => {
    const { output } = await runAction(
      getDocketNumbersForConsolidatedServiceAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
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
      docketNumbers: [MOCK_CASE.docketNumber],
    });
  });

  it('should return the docketNumbers for both lead and non-lead consolidated cases for a multi-docketable document on a lead case', async () => {
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
      docketNumbers: [
        MOCK_CASE.docketNumber,
        MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
      ],
    });
  });
});
