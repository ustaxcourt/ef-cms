import { ALLOWLIST_FEATURE_FLAGS } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setIsExternalConsolidatedCaseGroupEnabledValueAction } from './setIsExternalConsolidatedCaseGroupEnabledValueAction';

describe('setIsExternalConsolidatedCaseGroupEnabledValueAction', () => {
  presenter.providers.applicationContext = applicationContext;
  let baseCase;

  beforeEach(() => {
    baseCase = MOCK_CASE;
  });

  it('should set setIsExternalConsolidatedCaseGroupEnabledValueAction to false on state when isConsolidatedGroupAccessEnabled flag is false', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };

    const result = await runAction(
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      {
        modules: { presenter },
        props: {
          overrideForRequestAccess: undefined,
        },
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: false,
          },
          form: {
            eventCode: 'ADMR',
          },
        },
      },
    );

    expect(result.state.isExternalConsolidatedCaseGroupFilingEnabled).toEqual(
      false,
    );
  });

  it('should set setIsExternalConsolidatedCaseGroupEnabledValueAction to true on state when isConsolidatedGroupAccessEnabled is true, case has a leadDocketNumber and has a multiDocketable event code', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };

    const result = await runAction(
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      {
        modules: { presenter },
        props: {
          overrideForRequestAccess: undefined,
        },
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ADMR',
          },
        },
      },
    );

    expect(result.state.isExternalConsolidatedCaseGroupFilingEnabled).toEqual(
      true,
    );
  });

  it('should set setIsExternalConsolidatedCaseGroupEnabledValueAction to false on state when case does not have a leadDocketNumber', async () => {
    const result = await runAction(
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      {
        modules: { presenter },
        props: {
          overrideForRequestAccess: undefined,
        },
        state: {
          caseDetail: baseCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ADMR',
          },
        },
      },
    );

    expect(result.state.isExternalConsolidatedCaseGroupFilingEnabled).toEqual(
      false,
    );
  });

  it('should set setIsExternalConsolidatedCaseGroupEnabledValueAction to false on state when there is not a multiDocketable event code', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };
    const result = await runAction(
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      {
        modules: { presenter },
        props: {
          overrideForRequestAccess: undefined,
        },
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ACED',
          },
        },
      },
    );

    expect(result.state.isExternalConsolidatedCaseGroupFilingEnabled).toEqual(
      false,
    );
  });

  it('should set setIsExternalConsolidatedCaseGroupEnabledValueAction to true on state when there is a overrideForRequestAccess', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };
    const result = await runAction(
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      {
        modules: { presenter },
        props: {
          overrideForRequestAccess: true,
        },
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {},
        },
      },
    );

    expect(result.state.isExternalConsolidatedCaseGroupFilingEnabled).toEqual(
      true,
    );
  });
});
