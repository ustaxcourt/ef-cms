import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PUBLIC_MOTION_RESPONSE_EVENT_CODES,
  PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS,
  ROLES,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import {
  calculateISODate,
  createISODateString,
} from '../utilities/DateHandler';
import { EXTERNAL_FILING_EVENTS } from '@shared/business/entities/docketEntry/externalFilingEvents';

describe('DocketEntry isPublic - motion response visibility', () => {
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
  const laterFilingDate = calculateISODate({
    dateString: afterMotionVisibilityChangeDate,
    howMuch: 1,
    units: 'days',
  });
  const NON_PUBLIC_SUPPORTING_EVENT_CODES = EXTERNAL_FILING_EVENTS[
    'Supporting Document'
  ]
    .map(event => event.eventCode)
    .filter(
      eventCode =>
        !PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS.includes(eventCode),
    );

  const MOTION_DOCUMENT_TYPE = 'Motion for Continuance';
  const MOTION_ID = '0d8e3a5e-0d3c-4b8a-9b1e-6a0f6b3b8c01';
  const RESPONSE_ID = '1f3e2c7a-5b6d-4c8e-9a0b-7c1d2e3f4a02';
  const SUPPORT_ID = '2a4b6c8d-0e1f-4a3b-8c5d-9e7f1a2b3c03';

  const baseDocketEntry: RawDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
    docketNumber: '123-45',
    documentStorageId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
    documentTitle: 'Some title',
    documentType: 'Some type',
    entityName: 'DocketEntry',
    eventCode: 'MISC',
    filers: [],
    filingDate: afterMotionVisibilityChangeDate,
    isOnDocketRecord: true,
    multiDocketedOn: [],
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '',
    servedAt: '2018-11-21T20:49:28.192Z',
    stampData: {},
  };

  // the target motion does not meet visibility criteria on purpose
  const motion: RawDocketEntry = {
    ...baseDocketEntry,
    docketEntryId: MOTION_ID,
    documentType: MOTION_DOCUMENT_TYPE,
    eventCode: 'M006',
    filedByRole: ROLES.petitioner,
    filingDate: beforeMotionVisibilityChangeDate,
    isPaper: true,
  };

  const linkTo = (docketEntryId: string) => ({
    docketEntryId,
    documentTitle: 'Some title',
    documentType: 'Some type',
  });

  const buildResponse = (
    eventCode: string,
    overrides: Partial<RawDocketEntry> = {},
  ): RawDocketEntry => ({
    ...baseDocketEntry,
    docketEntryId: RESPONSE_ID,
    eventCode,
    filedByRole: ROLES.privatePractitioner,
    isPaper: false,
    previousDocument: linkTo(MOTION_ID),
    ...overrides,
  });

  const buildSupport = (
    eventCode: string,
    overrides: Partial<RawDocketEntry> = {},
  ): RawDocketEntry => ({
    ...baseDocketEntry,
    docketEntryId: SUPPORT_ID,
    eventCode,
    filedByRole: ROLES.privatePractitioner,
    isPaper: false,
    previousDocument: linkTo(RESPONSE_ID),
    ...overrides,
  });

  const isPublic = (
    entry: RawDocketEntry,
    docketEntries: RawDocketEntry[],
    { caseIsSealed = false }: { caseIsSealed?: boolean } = {},
  ) =>
    DocketEntry.isPublic(entry, {
      caseIsSealed,
      docketEntries,
      rootDocument: DocketEntry.fetchRootDocument(entry, docketEntries),
      visibilityChangeDate,
      motionVisibilityChangeDate,
    });

  describe.each(PUBLIC_MOTION_RESPONSE_EVENT_CODES)(
    'response code %s',
    responseEventCode => {
      describe.each([ROLES.privatePractitioner, ROLES.irsPractitioner])(
        'filed by a %s',
        role => {
          it('should return true when the target is a motion and the response is filed after the policy date', () => {
            const response = buildResponse(responseEventCode, {
              filedByRole: role,
            });

            expect(isPublic(response, [motion, response])).toBe(true);
          });

          it('should return true when the response is filed on the policy date', () => {
            const response = buildResponse(responseEventCode, {
              filedByRole: role,
              filingDate: motionVisibilityChangeDate,
            });

            expect(isPublic(response, [motion, response])).toBe(true);
          });

          it('should return false when the response is filed before the policy date', () => {
            const response = buildResponse(responseEventCode, {
              filedByRole: role,
              filingDate: beforeMotionVisibilityChangeDate,
            });

            expect(isPublic(response, [motion, response])).toBe(false);
          });
        },
      );

      it('should return false when the response is filed by a petitioner', () => {
        const response = buildResponse(responseEventCode, {
          filedByRole: ROLES.petitioner,
        });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the response is paper filed', () => {
        const response = buildResponse(responseEventCode, { isPaper: true });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the target is not a motion', () => {
        const brief: RawDocketEntry = {
          ...baseDocketEntry,
          docketEntryId: MOTION_ID,
          documentType: 'Seriatim Opening Brief',
          eventCode: 'SEOB',
        };
        const response = buildResponse(responseEventCode);

        expect(isPublic(response, [brief, response])).toBe(false);
      });

      it('should return false when the target is a response to a motion', () => {
        const priorResponse = buildResponse('RSP', {
          docketEntryId: '3b5c7d9e-1f2a-4b4c-9d6e-0f8a2b3c4d04',
        });
        const response = buildResponse(responseEventCode, {
          previousDocument: linkTo(priorResponse.docketEntryId),
        });

        expect(isPublic(response, [motion, priorResponse, response])).toBe(
          false,
        );
      });

      it('should return true when the target is not on the case but its saved document type is a motion', () => {
        const response = buildResponse(responseEventCode, {
          previousDocument: {
            ...linkTo(MOTION_ID),
            documentType: MOTION_DOCUMENT_TYPE,
          },
        });

        expect(isPublic(response, [response])).toBe(true);
      });

      it('should return false when the target is not on the case and its saved document type is not a motion', () => {
        const response = buildResponse(responseEventCode, {
          previousDocument: {
            ...linkTo(MOTION_ID),
            documentType: 'Seriatim Opening Brief',
          },
        });

        expect(isPublic(response, [response])).toBe(false);
      });

      it('should use the target on the case over its saved document type', () => {
        const brief: RawDocketEntry = {
          ...baseDocketEntry,
          docketEntryId: MOTION_ID,
          eventCode: 'SEOB',
        };
        const response = buildResponse(responseEventCode, {
          previousDocument: {
            ...linkTo(MOTION_ID),
            documentType: MOTION_DOCUMENT_TYPE,
          },
        });

        expect(isPublic(response, [brief, response])).toBe(false);
      });

      it('should return false when the response has no target', () => {
        const response = buildResponse(responseEventCode, {
          previousDocument: undefined,
        });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the response is lodged', () => {
        const response = buildResponse(responseEventCode, { lodged: true });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the response is sealed', () => {
        const response = buildResponse(responseEventCode, { isSealed: true });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the case is sealed', () => {
        const response = buildResponse(responseEventCode);

        expect(
          isPublic(response, [motion, response], { caseIsSealed: true }),
        ).toBe(false);
      });

      it('should return false when the response is stricken', () => {
        const response = buildResponse(responseEventCode, { isStricken: true });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      it('should return false when the response is not served', () => {
        const response = buildResponse(responseEventCode, {
          servedAt: undefined,
        });

        expect(isPublic(response, [motion, response])).toBe(false);
      });

      describe.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
        'supporting document %s',
        supportingEventCode => {
          it('should return true when filed in the same filing as a public response', () => {
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode);

            expect(isPublic(support, [motion, response, support])).toBe(true);
          });

          it('should return false when filed after the response', () => {
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode, {
              filingDate: laterFilingDate,
            });

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });

          it('should return false when filed before the policy date', () => {
            const response = buildResponse(responseEventCode, {
              filingDate: beforeMotionVisibilityChangeDate,
            });
            const support = buildSupport(supportingEventCode, {
              filingDate: beforeMotionVisibilityChangeDate,
            });

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });

          it('should return false when the parent response is lodged', () => {
            const response = buildResponse(responseEventCode, {
              lodged: true,
            });
            const support = buildSupport(supportingEventCode);

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });

          it('should return true when the target motion is not on the case but its saved document type is a motion', () => {
            const response = buildResponse(responseEventCode, {
              previousDocument: {
                ...linkTo(MOTION_ID),
                documentType: MOTION_DOCUMENT_TYPE,
              },
            });
            const support = buildSupport(supportingEventCode);

            expect(isPublic(support, [response, support])).toBe(true);
          });

          it('should return false when the parent response does not target a motion', () => {
            const brief: RawDocketEntry = {
              ...baseDocketEntry,
              docketEntryId: MOTION_ID,
              eventCode: 'SEOB',
            };
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode);

            expect(isPublic(support, [brief, response, support])).toBe(false);
          });

          it('should return false when filed by a petitioner', () => {
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode, {
              filedByRole: ROLES.petitioner,
            });

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });

          it('should return false when sealed', () => {
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode, {
              isSealed: true,
            });

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });

          it('should return false when stricken', () => {
            const response = buildResponse(responseEventCode);
            const support = buildSupport(supportingEventCode, {
              isStricken: true,
            });

            expect(isPublic(support, [motion, response, support])).toBe(false);
          });
        },
      );

      it.each(NON_PUBLIC_SUPPORTING_EVENT_CODES)(
        'should return false for supporting document %s filed in the same filing',
        supportingEventCode => {
          const response = buildResponse(responseEventCode);
          const support = buildSupport(supportingEventCode);

          expect(isPublic(support, [motion, response, support])).toBe(false);
        },
      );
    },
  );

  it('should return false for a non-response event code that targets a motion', () => {
    const reply = buildResponse('REPL');

    expect(isPublic(reply, [motion, reply])).toBe(false);
  });
});
