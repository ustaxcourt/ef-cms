import {
  CASE_STATUS_TYPES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from './DocketEntry';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { applicationContext } from '../test/createTestApplicationContext';
import { MOCK_CASE } from '@shared/test/mockCase';
import { casePetitioner, petitionerUser } from '@shared/test/mockUsers';
import { cloneDeep } from 'lodash';

describe('DocketEntry isDownloadable motion visibility', () => {
  const visibilityChangeDate = createISODateString('2023-08-01', 'yyyy-MM-dd');
  const motionVisibilityChangeDate = createISODateString(
    '2027-01-01',
    'yyyy-MM-dd',
  );
  const beforeMotionVisibilityChangeDate = calculateISODate({
    dateString: motionVisibilityChangeDate,
    howMuch: -1,
    units: 'days',
  });
  const afterMotionVisibilityChangeDate = calculateISODate({
    dateString: motionVisibilityChangeDate,
    howMuch: 1,
    units: 'days',
  });

  let baseDocketEntry: RawDocketEntry;
  let laterBriefDocketEntryId: string;
  let motionDocketEntryId: string;
  let rawCase: RawCase;
  let rootMotionDocketEntryId: string;

  beforeEach(() => {
    rawCase = cloneDeep(MOCK_CASE);
    rawCase.status = CASE_STATUS_TYPES.generalDocket;
    rawCase.docketEntries[0].servedAt = motionVisibilityChangeDate;
    baseDocketEntry = rawCase.docketEntries[0];
    motionDocketEntryId = applicationContext.getUniqueId();
    rootMotionDocketEntryId = applicationContext.getUniqueId();
    laterBriefDocketEntryId = applicationContext.getUniqueId();
  });

  const createPractitionerMotionEntry = (
    overrides: Partial<RawDocketEntry> = {},
  ): RawDocketEntry => ({
    ...baseDocketEntry,
    docketEntryId: motionDocketEntryId,
    eventCode: 'M006',
    filingDate: motionVisibilityChangeDate,
    filedByRole: ROLES.privatePractitioner,
    isFileAttached: true,
    isOnDocketRecord: true,
    isPaper: false,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    servedAt: motionVisibilityChangeDate,
    ...overrides,
  });

  describe('External with no access to the case', () => {
    let options;

    beforeEach(() => {
      options = {
        isTerminalUser: false,
        rawCase,
        user: petitionerUser,
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };
    });

    describe('Before/after motion visibility change date', () => {
      it.each([
        {
          description: 'practitioner motion on the policy date',
          input: {},
          output: true,
        },
        {
          description: 'practitioner motion filed before the policy date',
          input: { filingDate: beforeMotionVisibilityChangeDate },
          output: false,
        },
        {
          description: 'lodged practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            lodged: true,
          },
          output: false,
        },
        {
          description: 'de-lodged practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            lodged: false,
          },
          output: true,
        },
        {
          description: 'de-lodged practitioner motion before the policy date',
          input: {
            filingDate: beforeMotionVisibilityChangeDate,
            lodged: false,
          },
          output: false,
        },
        {
          description: 'paper practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            isPaper: true,
          },
          output: false,
        },
        {
          description: 'petitioner-filed motion after the policy date',
          input: {
            filedByRole: ROLES.petitioner,
            filingDate: afterMotionVisibilityChangeDate,
          },
          output: false,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry(input),
            options,
          ),
        ).toEqual(output);
      });
    });

    describe('Brief in support filed after a motion filed before the policy date', () => {
      it('returns false for a public user without case access because the motion is not public', () => {
        const rootMotion = createPractitionerMotionEntry({
          docketEntryId: rootMotionDocketEntryId,
          filingDate: beforeMotionVisibilityChangeDate,
        });
        const laterBrief = createPractitionerMotionEntry({
          docketEntryId: laterBriefDocketEntryId,
          eventCode: 'BRF',
          filingDate: motionVisibilityChangeDate,
          previousDocument: {
            docketEntryId: rootMotionDocketEntryId,
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        });
        rawCase.docketEntries = [
          ...rawCase.docketEntries,
          rootMotion,
          laterBrief,
        ];

        expect(DocketEntry.isDownloadable(laterBrief, options)).toEqual(false);
      });
    });

    describe('Sealed or stricken practitioner motions', () => {
      it.each([
        {
          description: 'sealed to the public',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          },
          output: false,
        },
        {
          description: 'sealed to the public and parties',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          },
          output: false,
        },
        {
          description: 'stricken',
          input: { isStricken: true },
          output: false,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry({
              filingDate: afterMotionVisibilityChangeDate,
              ...input,
            }),
            options,
          ),
        ).toEqual(output);
      });
    });
  });

  describe('External user with access to the case', () => {
    let options;

    beforeEach(() => {
      options = {
        isTerminalUser: false,
        rawCase,
        user: {
          ...petitionerUser,
          entityName: 'User',
          userId: casePetitioner.contactId,
        },
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };

      rawCase.petitioners = [casePetitioner];
    });

    describe('After motion visibility change date', () => {
      it.each([
        {
          description: 'practitioner motion on the policy date',
          input: {},
          output: true,
        },
        {
          description: 'practitioner motion filed before the policy date',
          input: { filingDate: beforeMotionVisibilityChangeDate },
          output: true,
        },
        {
          description: 'lodged practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            lodged: true,
          },
          output: true,
        },
        {
          description: 'paper practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            isPaper: true,
          },
          output: true,
        },
        {
          description: 'petitioner-filed motion after the policy date',
          input: {
            filedByRole: ROLES.petitioner,
            filingDate: afterMotionVisibilityChangeDate,
          },
          output: true,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry(input),
            options,
          ),
        ).toEqual(output);
      });
    });

    describe('Brief in support filed after a motion filed before the policy date', () => {
      it('returns true if the document is Public', () => {
        const rootMotion = createPractitionerMotionEntry({
          docketEntryId: rootMotionDocketEntryId,
          filingDate: beforeMotionVisibilityChangeDate,
        });
        const laterBrief = createPractitionerMotionEntry({
          docketEntryId: laterBriefDocketEntryId,
          eventCode: 'BRF',
          filingDate: motionVisibilityChangeDate,
          previousDocument: {
            docketEntryId: rootMotionDocketEntryId,
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        });
        rawCase.docketEntries = [
          ...rawCase.docketEntries,
          rootMotion,
          laterBrief,
        ];

        expect(DocketEntry.isDownloadable(laterBrief, options)).toEqual(true);
      });
    });

    describe('Sealed or stricken practitioner motions', () => {
      it.each([
        {
          description: 'sealed to the public',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          },
          output: true,
        },
        {
          description: 'sealed to the public and parties',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          },
          output: false,
        },
        {
          description: 'stricken',
          input: { isStricken: true },
          output: false,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry({
              filingDate: afterMotionVisibilityChangeDate,
              ...input,
            }),
            options,
          ),
        ).toEqual(output);
      });
    });
  });

  describe('Terminal User', () => {
    let options;

    beforeEach(() => {
      options = {
        isTerminalUser: true,
        rawCase,
        user: {
          entityName: 'User',
          name: '',
          role: 'petitioner',
          userId: '',
        },
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };
    });

    describe('After motion visibility change date', () => {
      it.each([
        {
          description: 'practitioner motion on the policy date',
          input: {},
          output: true,
        },
        {
          description: 'practitioner motion filed before the policy date',
          input: { filingDate: beforeMotionVisibilityChangeDate },
          output: true,
        },
        {
          description: 'lodged practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            lodged: true,
          },
          output: true,
        },
        {
          description: 'paper practitioner motion after the policy date',
          input: {
            filingDate: afterMotionVisibilityChangeDate,
            isPaper: true,
          },
          output: true,
        },
        {
          description: 'petitioner-filed motion after the policy date',
          input: {
            filedByRole: ROLES.petitioner,
            filingDate: afterMotionVisibilityChangeDate,
          },
          output: true,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry(input),
            options,
          ),
        ).toEqual(output);
      });
    });

    describe('Brief in support filed after a motion filed before the policy date', () => {
      it('returns true if the document is not Public', () => {
        const rootMotion = createPractitionerMotionEntry({
          docketEntryId: rootMotionDocketEntryId,
          filingDate: beforeMotionVisibilityChangeDate,
        });
        const laterBrief = createPractitionerMotionEntry({
          docketEntryId: laterBriefDocketEntryId,
          eventCode: 'BRF',
          filingDate: motionVisibilityChangeDate,
          previousDocument: {
            docketEntryId: rootMotionDocketEntryId,
            documentTitle: 'Motion for Continuance',
            documentType: 'Motion for Continuance',
          },
        });
        rawCase.docketEntries = [
          ...rawCase.docketEntries,
          rootMotion,
          laterBrief,
        ];

        expect(DocketEntry.isDownloadable(laterBrief, options)).toEqual(true);
      });
    });

    describe('Sealed or stricken practitioner motions', () => {
      it.each([
        {
          description: 'sealed to the public',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          },
          output: false,
        },
        {
          description: 'sealed to the public and parties',
          input: {
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          },
          output: false,
        },
        {
          description: 'stricken',
          input: { isStricken: true },
          output: false,
        },
      ])('$description', ({ input, output }) => {
        expect(
          DocketEntry.isDownloadable(
            createPractitionerMotionEntry({
              filingDate: afterMotionVisibilityChangeDate,
              ...input,
            }),
            options,
          ),
        ).toEqual(output);
      });
    });
  });
});
