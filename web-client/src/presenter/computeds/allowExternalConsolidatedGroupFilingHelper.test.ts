import {
  ALLOWLIST_FEATURE_FLAGS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { allowExternalConsolidatedGroupFilingHelper as allowExternalConsolidatedGroupFilingHelperComputed } from '@web-client/presenter/computeds/allowExternalConsolidatedGroupFilingHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('allowExternalConsolidatedGroupFilingHelper', () => {
  let baseCase;

  const allowExternalConsolidatedGroupFilingHelper = withAppContextDecorator(
    allowExternalConsolidatedGroupFilingHelperComputed,
    applicationContext,
  );

  beforeAll(() => {
    (applicationContext.getCurrentUser as any).mockReturnValue({
      role: ROLES.privatePractitioner,
    });
  });

  beforeEach(() => {
    baseCase = MOCK_CASE;
  });

  it('should return false when isConsolidatedGroupAccessEnabled flag is false', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };

    const result = await runCompute(
      allowExternalConsolidatedGroupFilingHelper,
      {
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: false,
          },
          form: {
            eventCode: 'ADMR',
          },
          screenMetadata: {
            isDirectlyAssociated: undefined,
          },
        },
      },
    );

    expect(result).toEqual(false);
  });

  it('should return true when isConsolidatedGroupAccessEnabled is true, caseDetail has a leadDocketNumber and has a multiDocketable event code', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };

    const result = await runCompute(
      allowExternalConsolidatedGroupFilingHelper,
      {
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ADMR',
          },
          screenMetadata: {
            isDirectlyAssociated: undefined,
          },
        },
      },
    );

    expect(result).toEqual(true);
  });

  it('should return false when case does not have a leadDocketNumber', async () => {
    const result = await runCompute(
      allowExternalConsolidatedGroupFilingHelper,
      {
        state: {
          caseDetail: baseCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ADMR',
          },
          screenMetadata: {
            isDirectlyAssociated: undefined,
          },
        },
      },
    );

    expect(result).toEqual(false);
  });

  it('should return false when there is not a multiDocketable event code', async () => {
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };
    const result = await runCompute(
      allowExternalConsolidatedGroupFilingHelper,
      {
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {
            eventCode: 'ACED',
          },
          screenMetadata: {
            isDirectlyAssociated: undefined,
          },
        },
      },
    );

    expect(result).toEqual(false);
  });

  it('should return true when in irsPractitioner is requesting access', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.irsPractitioner,
    });
    const testCase = { ...baseCase, leadDocketNumber: '111-11' };
    const result = await runCompute(
      allowExternalConsolidatedGroupFilingHelper,
      {
        state: {
          caseDetail: testCase,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER
              .key]: true,
          },
          form: {},
          screenMetadata: {
            isDirectlyAssociated: true,
          },
        },
      },
    );

    expect(result).toEqual(true);
  });
});
