import {
  ALL_EVENT_CODES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
} from '../EntityConstants';
import { PublicCase } from './PublicCase';
import { createISODateString } from '../../utilities/DateHandler';

describe('PublicCase isPrivateDocument', () => {
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
    };

    it(`returns false before the visibility change (${eventCode})`, () => {
      const isPrivate = PublicCase.isPrivateDocument(
        { ...baseDocketEntry, filingDate: beforeVisibilityChangeDate },
        visibilityChangeDate,
      );

      if (isPrivate) {
        console.log({ eventCode });
      }
      expect(isPrivate).toEqual(false);
    });

    it(`returns false after the visibility change (${eventCode})`, () => {
      const isPrivate = PublicCase.isPrivateDocument(
        {
          ...baseDocketEntry,
          filingDate: afterVisibilityChangeDate,
        },
        visibilityChangeDate,
      );

      expect(isPrivate).toEqual(false);
    });

    it(`returns true if it is not on the docket record (${eventCode})`, () => {
      const isPrivate = PublicCase.isPrivateDocument(
        {
          ...baseDocketEntry,
          isOnDocketRecord: false,
        },
        visibilityChangeDate,
      );

      expect(isPrivate).toEqual(true);
    });

    it(`returns true if it is stricken (${eventCode})`, () => {
      const isPrivate = PublicCase.isPrivateDocument(
        {
          ...baseDocketEntry,
          isStricken: true,
        },
        visibilityChangeDate,
      );

      expect(isPrivate).toEqual(true);
    });
  });

  describe('Documents impacted by Policy Date Change', () => {
    describe.each(POLICY_DATE_IMPACTED_EVENTCODES)(
      'before the visibility policy date change',
      eventCode => {
        const filingDate = beforeVisibilityChangeDate;
        it(`returns true (is private) (${eventCode})`, () => {
          const isPrivate = PublicCase.isPrivateDocument(
            {
              docketEntryId: '123',
              eventCode,
              filingDate,
              isOnDocketRecord: true,
              previousDocument: {
                docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                documentType: 'Seriatim Answering Brief',
              },
            },
            visibilityChangeDate,
          );
          if (!isPrivate) {
            console.log(eventCode);
          }
          expect(isPrivate).toEqual(true);
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
            filedByRole: 'privatePractitioner',
            filingDate,
            isOnDocketRecord: true,
          };
          it(`returns true if it is paper (${eventCode})`, () => {
            const isPrivate = PublicCase.isPrivateDocument(
              {
                ...baseDocketEntry,
                isPaper: true,
              },
              visibilityChangeDate,
            );

            expect(isPrivate).toEqual(true);
          });

          it.each(practitionerRoles)(
            `returns false if the filing party is a practitioner and it is electronically filed (${eventCode})`,
            filedByRole => {
              const isPrivate = PublicCase.isPrivateDocument(
                {
                  ...baseDocketEntry,
                  filedByRole,
                },
                visibilityChangeDate,
              );

              expect(isPrivate).toEqual(false);
            },
          );

          it.each(otherRoles)(
            `returns true if the filing party is not a practitioner and it is electronically filed (${eventCode})`,
            filedByRole => {
              const isPrivate = PublicCase.isPrivateDocument(
                {
                  ...baseDocketEntry,
                  filedByRole,
                },
                visibilityChangeDate,
              );

              expect(isPrivate).toEqual(true);
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
            filedByRole: 'privatePractitioner',
            filingDate,
            isOnDocketRecord: true,
            isPaper: false,
            previousDocument: {
              docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
              documentType: 'Seriatim Answering Brief',
            },
          };

          it(`returns true if it is paper (${eventCode})`, () => {
            const isPrivate = PublicCase.isPrivateDocument(
              {
                ...baseDocketEntry,
                isPaper: true,
              },
              visibilityChangeDate,
            );

            expect(isPrivate).toEqual(true);
          });

          it.each(practitionerRoles)(
            `returns false if the filing party is a practitioner and it is electronically filed (${eventCode})`,
            filedByRole => {
              const isPrivate = PublicCase.isPrivateDocument(
                {
                  docketEntryId: '123',
                  eventCode,
                  filedByRole,
                  filingDate,
                  isOnDocketRecord: true,
                  isPaper: false,
                  previousDocument: {
                    docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                    documentType: 'Seriatim Answering Brief',
                    // filedByRole: 'privatePractitioner'
                  },
                },
                visibilityChangeDate,
              );

              expect(isPrivate).toEqual(false);
            },
          );

          // there's currently no good way to determine this information
          it.todo(
            'returns false if the previousDocument was filed by a practitioner',
          );
          it.todo(
            'returns true if the previousDocument was not filed by a Practitioner',
          );

          it.each(otherRoles)(
            `returns true if the filing party is not a practitioner  (${eventCode})`,
            filedByRole => {
              const isPrivate = PublicCase.isPrivateDocument(
                {
                  docketEntryId: '123',
                  eventCode,
                  filedByRole,
                  filingDate,
                  isOnDocketRecord: true,
                  isPaper: false,
                  previousDocument: {
                    docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                    documentType: 'Seriatim Answering Brief',
                  },
                },
                visibilityChangeDate,
              );

              expect(isPrivate).toEqual(true);
            },
          );

          it('returns true when the docket entry is an amended document that does not have a previousDocument', () => {
            const isPrivate = PublicCase.isPrivateDocument(
              {
                docketEntryId: '1451c228-49d6-44a9-ac02-d797be308661',
                documentType: 'Amended',
                eventCode,
                filingDate,
                isOnDocketRecord: true,
                isStricken: false,
              },
              visibilityChangeDate,
            );

            expect(isPrivate).toEqual(true);
          });
        },
      );

      describe.each(['SDEC', 'AMBR'])(
        'Amicus Briefs and Stip Decisions',
        eventCode => {
          it(`returns false (${eventCode})`, () => {
            const isPrivate = PublicCase.isPrivateDocument(
              {
                docketEntryId: '123',
                eventCode,
                filingDate,
                isOnDocketRecord: true,
              },
              visibilityChangeDate,
            );

            expect(isPrivate).toEqual(false);
          });
        },
      );
    });
  });

  describe('All other Documents', () => {
    const allOtherEventCodes = ALL_EVENT_CODES.filter(
      eventCode =>
        ![
          'DEC',
          ...ORDER_EVENT_CODES,
          ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
          ...POLICY_DATE_IMPACTED_EVENTCODES,
        ].includes(eventCode),
    );

    it.each(allOtherEventCodes)(
      'returns true before the visibility change',
      eventCode => {
        const isPrivate = PublicCase.isPrivateDocument(
          {
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            eventCode,
            filingDate: beforeVisibilityChangeDate,
            isOnDocketRecord: true,
          },
          visibilityChangeDate,
        );

        expect(isPrivate).toEqual(true);
      },
    );

    it.each(allOtherEventCodes)(
      'returns true after the visibility change',
      eventCode => {
        const isPrivate = PublicCase.isPrivateDocument(
          {
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            eventCode,
            filingDate: afterVisibilityChangeDate,
            isOnDocketRecord: true,
          },
          visibilityChangeDate,
        );

        if (!isPrivate) {
          console.log(`asdf: ${eventCode}`);
        }

        expect(isPrivate).toEqual(true);
      },
    );
  });
});
