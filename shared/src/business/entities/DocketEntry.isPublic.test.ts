import {
  ALL_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';
import { createISODateString } from '../utilities/DateHandler';

describe('DocketEntry isPublic', () => {
  const visibilityChangeDate = createISODateString('2023-08-01', 'yyyy-MM-dd');
  const beforeVisibilityChangeDate = createISODateString(
    '2022-08-01',
    'yyyy-MM-dd',
  );
  const afterVisibilityChangeDate = createISODateString(
    '2024-08-01',
    'yyyy-MM-dd',
  );
  const amendmentEventCodes = ['AMAT', 'ADMT', 'REDC', 'SPML', 'SUPM'];

  describe.each([
    'DEC',
    ...ORDER_EVENT_CODES,
    ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ])('Order, Opinion, and Decision Event Codes', eventCode => {
    const baseDocketEntry = {
      docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
      eventCode,
      filingDate: beforeVisibilityChangeDate,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    };

    it.each([beforeVisibilityChangeDate, afterVisibilityChangeDate])(
      'returns true before and after the visibility change',
      filingDate => {
        const docketEntry = new DocketEntry(
          {
            ...baseDocketEntry,
            filingDate,
          },
          { applicationContext },
        );
        const isPublic = docketEntry.isPublic({
          visibilityChangeDate,
        });

        if (!isPublic) {
          console.log({ docketEntry });
        }

        expect(isPublic).toEqual(true);
      },
    );

    it('returns false if it is not on the docket record', () => {
      const docketEntry = new DocketEntry(
        {
          ...baseDocketEntry,
          isOnDocketRecord: false,
        },
        { applicationContext },
      );
      const isPublic = docketEntry.isPublic({
        visibilityChangeDate,
      });

      expect(isPublic).toEqual(false);
    });

    it('returns false if it is pending', () => {
      const docketEntry = new DocketEntry(
        {
          ...baseDocketEntry,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        { applicationContext },
      );
      const isPublic = docketEntry.isPublic({
        visibilityChangeDate,
      });

      expect(isPublic).toEqual(false);
    });

    it('returns false if it is stricken', () => {
      const docketEntry = new DocketEntry(
        {
          ...baseDocketEntry,
          isStricken: true,
        },
        { applicationContext },
      );
      const isPublic = docketEntry.isPublic({
        visibilityChangeDate,
      });

      expect(isPublic).toEqual(false);
    });
  });

  describe('Documents impacted by Policy Date Change', () => {
    describe.each(POLICY_DATE_IMPACTED_EVENTCODES)(
      'before the visibility policy date change',
      eventCode => {
        it('returns false', () => {
          const docketEntry = new DocketEntry(
            {
              docketEntryId: '123',
              eventCode,
              filingDate: beforeVisibilityChangeDate,
              previousDocument: {
                docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                documentType: 'Seriatim Answering Brief',
              },
            },
            { applicationContext },
          );

          const isPublic = docketEntry.isPublic({ visibilityChangeDate });
          expect(isPublic).toEqual(false);
        });
      },
    );

    describe('after the visibility policy date change', () => {
      const filingDate = afterVisibilityChangeDate;

      const practitionerFiledBriefs = POLICY_DATE_IMPACTED_EVENTCODES.filter(
        eventCode =>
          ![...amendmentEventCodes, 'SDEC', 'AMBR'].includes(eventCode),
      );

      const practitionerRoles = [
        ROLES.privatePractitioner,
        ROLES.irsPractitioner,
      ];
      const otherRoles = Object.values(ROLES).filter(
        role => !practitionerRoles.includes(role),
      );

      describe.each(practitionerFiledBriefs)(
        'Practitioner-Filed Briefs',
        eventCode => {
          const baseDocketEntry = {
            docketEntryId: '123',
            eventCode,
            filedByRole: ROLES.privatePractitioner,
            filingDate,
            isOnDocketRecord: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          };
          it('returns false if it is paper', () => {
            const docketEntry = new DocketEntry(
              { ...baseDocketEntry, isPaper: true },
              { applicationContext },
            );
            const isPublic = docketEntry.isPublic({
              visibilityChangeDate,
            });

            expect(isPublic).toEqual(false);
          });

          it.each(practitionerRoles)(
            'returns true if the filing party is a practitioner and it is electronically filed',
            filedByRole => {
              const docketEntry = new DocketEntry(
                { ...baseDocketEntry, filedByRole },
                { applicationContext },
              );
              const isPublic = docketEntry.isPublic({
                visibilityChangeDate,
              });

              expect(isPublic).toEqual(true);
            },
          );

          it.each(otherRoles)(
            'returns false if the filing party is not a practitioner and it is electronically filed',
            filedByRole => {
              const docketEntry = new DocketEntry(
                { ...baseDocketEntry, filedByRole },
                { applicationContext },
              );
              const isPublic = docketEntry.isPublic({
                visibilityChangeDate,
              });

              expect(isPublic).toEqual(false);
            },
          );
        },
      );

      describe.each(amendmentEventCodes)(
        'Amendments to Practitioner-Filed Briefs',
        eventCode => {
          // must be electronic
          // must be filed by Practitioner
          const baseDocketEntry = {
            docketEntryId: '123',
            eventCode,
            filedByRole: ROLES.privatePractitioner,
            filingDate,
            isOnDocketRecord: true,
            isPaper: false,
            previousDocument: {
              docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
              documentType: 'Seriatim Answering Brief',
            },
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          };

          it('returns false if it is paper', () => {
            const docketEntry = new DocketEntry(
              { ...baseDocketEntry, isPaper: true },
              { applicationContext },
            );
            const isPublic = docketEntry.isPublic({
              visibilityChangeDate,
            });

            expect(isPublic).toEqual(false);
          });

          it.each(practitionerRoles)(
            'returns true if the filing party is a practitioner and it is electronically filed',
            filedByRole => {
              const docketEntry = new DocketEntry(
                { ...baseDocketEntry, filedByRole },
                { applicationContext },
              );
              const rootDocument = new DocketEntry(
                {
                  docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                  documentType: 'Seriatim Answering Brief',
                  filedByRole: ROLES.privatePractitioner,
                  isPaper: false,
                },
                { applicationContext },
              );
              const isPublic = docketEntry.isPublic({
                rootDocument,
                visibilityChangeDate,
              });

              expect(isPublic).toEqual(true);
            },
          );

          it('returns false if the rootDocument was not filed by a Practitioner', () => {
            const docketEntry = new DocketEntry(
              { ...baseDocketEntry, filedByRole: ROLES.privatePractitioner },
              { applicationContext },
            );
            const rootDocument = new DocketEntry(
              {
                docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                documentType: 'Seriatim Answering Brief',
                filedByRole: ROLES.petitioner,
                isPaper: false,
              },
              { applicationContext },
            );
            const isPublic = docketEntry.isPublic({
              rootDocument,
              visibilityChangeDate,
            });

            expect(isPublic).toEqual(false);
          });

          it.each(otherRoles)(
            'returns false if the filing party is not a practitioner',
            filedByRole => {
              const docketEntry = new DocketEntry(
                { ...baseDocketEntry, filedByRole },
                { applicationContext },
              );
              const isPublic = docketEntry.isPublic({
                visibilityChangeDate,
              });

              expect(isPublic).toEqual(false);
            },
          );

          it('returns false when the docket entry is an amended document that does not have a rootDocument', () => {
            const docketEntry = new DocketEntry(
              { ...baseDocketEntry },
              { applicationContext },
            );
            const isPublic = docketEntry.isPublic({
              rootDocument: undefined,
              visibilityChangeDate,
            });

            expect(isPublic).toEqual(false);
          });
        },
      );

      describe.each(['SDEC', 'AMBR'])(
        'Amicus Briefs and Stip Decisions',
        eventCode => {
          it('returns true', () => {
            const docketEntry = new DocketEntry(
              {
                docketEntryId: '123',
                eventCode,
                filingDate,
                isOnDocketRecord: true,
                processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
              },
              { applicationContext },
            );
            const isPublic = docketEntry.isPublic({ visibilityChangeDate });

            expect(isPublic).toEqual(true);
          });
        },
      );
    });
  });

  const allOtherEventCodes = ALL_EVENT_CODES.filter(
    eventCode =>
      ![
        'DEC',
        ...ORDER_EVENT_CODES,
        ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        ...POLICY_DATE_IMPACTED_EVENTCODES,
      ].includes(eventCode),
  );

  describe.each(allOtherEventCodes)('All other Documents', eventCode => {
    it.each([beforeVisibilityChangeDate, afterVisibilityChangeDate])(
      'returns false before and after visibility change',
      filingDate => {
        const docketEntry = new DocketEntry(
          {
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            eventCode,
            filingDate,
            isOnDocketRecord: true,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
          { applicationContext },
        );
        const isPublic = docketEntry.isPublic({
          visibilityChangeDate,
        });

        expect(isPublic).toEqual(false);
      },
    );
  });
});
