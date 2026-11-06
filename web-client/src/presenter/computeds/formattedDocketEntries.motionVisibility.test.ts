import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import {
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { getFormattedDocketEntry } from './formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { type Get } from 'cerebral';
import { type FormattedDocketEntry } from '@shared/business/utilities/getFormattedCaseDetail';

let mockIsNotServedDocument;
jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  computeIsNotServedDocument: jest
    .fn()
    .mockImplementation(() => mockIsNotServedDocument),
}));
import { DocketEntry } from '@shared/business/entities/DocketEntry';

import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;
const isDownloadableMock = jest.spyOn(DocketEntry, 'isDownloadable');

const motionVisibilityChangeDate = formatDateString(
  createISODateString(),
  FORMATS.YYYYMMDD,
);

describe('getFormattedDocketEntry', () => {
  let simpleDocketEntry;
  let mockCase;
  let baseParams;

  beforeEach(() => {
    mockIsNotServedDocument = false;
    isDownloadableMock.mockImplementation(() => true);
    mockCase = cloneDeep(MOCK_CASE);
    baseParams = {
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      entry: simpleDocketEntry,
      formattedCase: {
        ...MOCK_CASE,
        filedByRole: ROLES.privatePractitioner,
      },
      permissions: {},
      rawCase: mockCase,
      user: privatePractitionerUser,
      visibilityPolicyDateFormatted: '',
      motionVisibilityPolicyDateFormatted: motionVisibilityChangeDate,
    };
    simpleDocketEntry = new DocketEntry(
      {
        filingDate: calculateISODate({
          dateString: motionVisibilityChangeDate,
          howMuch: 1,
          units: 'years',
        }),
      },
      { authorizedUser: undefined },
    );
  });

  describe('motion visibility policy date formatted', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      isDownloadableMock.mockImplementation(() => true);
      getFeatureFlagValues.mockResolvedValue([
        {
          name: 'motion-visibility-policy-change-date',
          value: {
            current: motionVisibilityChangeDate,
          },
        },
      ]);
    });

    it('should correctly format the motion visibility policy date', () => {
      runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        isDownloadableMock.mock.calls[0][1].motionVisibilityChangeDate,
      ).toBe(motionVisibilityChangeDate);
    });
  });

  describe('motion visibility document links for unassociated external user', () => {
    const policyDate = createISODateString('2027-01-01', 'yyyy-MM-dd');
    const afterPolicyFilingDate = calculateISODate({
      dateString: policyDate,
      howMuch: 1,
      units: 'days',
    });
    const beforePolicyFilingDate = calculateISODate({
      dateString: policyDate,
      howMuch: -1,
      units: 'days',
    });

    const buildPractitionerMotionBundle = (filingDate: string) => {
      const motionDocketEntryId = applicationContext.getUniqueId();
      const completeDocketEntry = {
        docketNumber: MOCK_CASE.docketNumber,
        filedByRole: ROLES.privatePractitioner,
        filingDate,
        isFileAttached: true,
        isOnDocketRecord: true,
        isPaper: false,
        isSealed: false,
        isStricken: false,
        lodged: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        receivedAt: filingDate,
        servedAt: filingDate,
      };

      const motionEntry = {
        ...completeDocketEntry,
        docketEntryId: motionDocketEntryId,
        documentTitle: 'Motion for Continuance',
        documentType: 'Motion for Continuance',
        eventCode: 'M006',
        index: 1,
      };
      const mispEntry = {
        ...completeDocketEntry,
        docketEntryId: applicationContext.getUniqueId(),
        documentTitle: 'Memorandum in Support of Motion for Continuance',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        index: 2,
        previousDocument: {
          docketEntryId: motionDocketEntryId,
          documentTitle: 'Motion for Continuance',
          documentType: 'Motion for Continuance',
        },
      };
      const brfEntry = {
        ...completeDocketEntry,
        docketEntryId: applicationContext.getUniqueId(),
        documentTitle: 'Brief in Support of Motion for Continuance',
        documentType: 'Brief in Support',
        eventCode: 'BRF',
        index: 3,
        previousDocument: {
          docketEntryId: motionDocketEntryId,
          documentTitle: 'Motion for Continuance',
          documentType: 'Motion for Continuance',
        },
      };

      return {
        entries: [motionEntry, mispEntry, brfEntry],
        motionDocketEntryId,
      };
    };

    beforeEach(() => {
      isDownloadableMock.mockRestore();
    });

    afterEach(() => {
      isDownloadableMock.mockImplementation(() => true);
    });

    it('should show document links for a post-policy practitioner motion, MISP, and BRF', () => {
      const { entries } = buildPractitionerMotionBundle(afterPolicyFilingDate);
      const rawCase = { ...cloneDeep(MOCK_CASE), docketEntries: entries };

      entries.forEach(entry => {
        const formattedEntry = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            entry,
            get,
            rawCase,
            user: petitionerUser,
            visibilityPolicyDateFormatted: createISODateString(
              '2023-08-01',
              'yyyy-MM-dd',
            ),
            motionVisibilityPolicyDateFormatted: policyDate,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(formattedEntry.showLinkToDocument).toBe(true);
        expect(formattedEntry.showDocumentViewerLink).toBe(false);
      });
    });

    it('should not show document links for a pre-policy practitioner motion, MISP, and BRF', () => {
      const { entries } = buildPractitionerMotionBundle(beforePolicyFilingDate);
      const rawCase = { ...cloneDeep(MOCK_CASE), docketEntries: entries };

      entries.forEach(entry => {
        const formattedEntry = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            entry,
            get,
            rawCase,
            user: petitionerUser,
            visibilityPolicyDateFormatted: createISODateString(
              '2023-08-01',
              'yyyy-MM-dd',
            ),
            motionVisibilityPolicyDateFormatted: policyDate,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(formattedEntry.showLinkToDocument).toBe(false);
        expect(formattedEntry.showDocumentDescriptionWithoutLink).toBe(true);
      });
    });
  });
});
