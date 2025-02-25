import { MOCK_CASE } from '@shared/test/mockCase';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextPublic } from '../../../applicationContextPublic';
import { cloneDeep } from 'lodash';
import { publicTrialSessionDetailsHelper as publicTrialSessionDetailsHelperComputed } from '@web-client/presenter/computeds/Public/publicTrialSessionDetailsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('publicTrialSessionDetailsHelper', () => {
  const publicTrialSessionDetailsHelper = withAppContextDecorator(
    publicTrialSessionDetailsHelperComputed,
    applicationContextPublic,
  );

  const MOCK_SEALED_CASE = cloneDeep(MOCK_CASE);
  MOCK_SEALED_CASE.isSealed = true;
  MOCK_SEALED_CASE.docketNumber = '101-23';
  MOCK_SEALED_CASE.docketNumberWithSuffix = '101-23';

  const MOCK_LEAD_CASE = cloneDeep(MOCK_CASE);
  MOCK_LEAD_CASE.docketNumber = '100-23';
  MOCK_LEAD_CASE.docketNumberWithSuffix = MOCK_LEAD_CASE.docketNumber;
  MOCK_LEAD_CASE.leadDocketNumber = MOCK_LEAD_CASE.docketNumber;

  const MOCK_CONSOLIDATED_CASE = cloneDeep(MOCK_CASE);
  MOCK_CONSOLIDATED_CASE.docketNumber = '102-23';
  MOCK_CONSOLIDATED_CASE.docketNumberWithSuffix = '102-23L';
  MOCK_CONSOLIDATED_CASE.leadDocketNumber = MOCK_LEAD_CASE.docketNumber;

  let state;

  beforeEach(() => {
    state = {
      trialSessionDetailsPage: {
        trialSession: {
          address1: '123 Main St',
          calendaredCases: [
            MOCK_CASE,
            MOCK_SEALED_CASE,
            MOCK_LEAD_CASE,
            MOCK_CONSOLIDATED_CASE,
          ],
          city: 'San Francisco',
          estimatedEndDate: '2020-11-29T05:00:00.000Z',
          isRemote: false,
          isSwingSession: true,
          postalCode: '94535',
          sessionStatus: SESSION_STATUS_TYPES.open,
          sessionType: SESSION_TYPES.regular,
          startDate: '2020-11-27T05:00:00.000Z',
          state: 'CA',
          swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
          swingSessionLocation: 'Dallas, Texas',
          term: 'Fall',
          termYear: '2020',
          trialLocation: 'Houston, Texas',
        },
      },
    };
  });

  it('should return formatted trial session details, including formatted cases, along with the current timestamp', () => {
    const result = runCompute(publicTrialSessionDetailsHelper, { state });

    const expectedMockCaseFormatted = {
      caseTitle: 'Test Petitioner',
      consolidatedIconTooltipText: undefined,
      docketNumber: MOCK_CASE.docketNumber,
      docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix,
      inConsolidatedGroup: false,
      irsPractitioners: [],
      isLeadCase: false,
      isSealed: undefined,
      privatePractitioners: [],
    };

    const expectedSealedCaseFormatted = {
      caseTitle: 'Sealed',
      consolidatedIconTooltipText: undefined,
      docketNumber: MOCK_SEALED_CASE.docketNumber,
      docketNumberWithSuffix: MOCK_SEALED_CASE.docketNumberWithSuffix,
      inConsolidatedGroup: false,
      irsPractitioners: [],
      isLeadCase: false,
      isSealed: true,
      privatePractitioners: [],
    };

    const expectedLeadCaseFormatted = {
      caseTitle: 'Test Petitioner',
      consolidatedIconTooltipText: 'Lead case in a consolidated group',
      docketNumber: MOCK_LEAD_CASE.docketNumber,
      docketNumberWithSuffix: MOCK_LEAD_CASE.docketNumberWithSuffix,
      inConsolidatedGroup: true,
      irsPractitioners: [],
      isLeadCase: true,
      isSealed: undefined,
      privatePractitioners: [],
    };

    const expectedConsolidatedCaseFormatted = {
      caseTitle: 'Test Petitioner',
      consolidatedIconTooltipText: 'Member case in a consolidated group',
      docketNumber: MOCK_CONSOLIDATED_CASE.docketNumber,
      docketNumberWithSuffix: MOCK_CONSOLIDATED_CASE.docketNumberWithSuffix,
      inConsolidatedGroup: true,
      irsPractitioners: [],
      isLeadCase: false,
      isSealed: undefined,
      privatePractitioners: [],
    };

    const expectedFormattedTrialSession = {
      address1: '123 Main St',
      address2: undefined,
      courthouseName: undefined,
      formattedCases: [
        expectedMockCaseFormatted,
        expectedLeadCaseFormatted,
        expectedConsolidatedCaseFormatted, // Should be sorted next to its lead case even though its docket number is after the sealed case
        expectedSealedCaseFormatted,
      ],
      formattedCityStateZip: 'San Francisco, CA 94535',
      formattedStartDate: '11/27/20',
      formattedStartDateFull: 'November 27, 2020',
      hasCourthouseInformation: true,
      isSwingSession: true,
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      swingSessionLocation: 'Dallas, Texas',
      trialLocation: 'Houston, Texas',
    };

    expect(result.formattedTrialSession).toMatchObject(
      expectedFormattedTrialSession,
    );
    expect(result.formattedNow).toMatch(
      /^\d{2}\/\d{2}\/\d{2} ([1-9]|1[0-2]):\d{2} (am|pm) Eastern$/,
    );
  });
});
