/* eslint-disable max-lines */
import {
  ALL_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  MOTION_EVENT_CODES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS,
  ROLES,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { createISODateString } from '../utilities/DateHandler';
import { EXTERNAL_FILING_EVENTS } from '@shared/business/entities/docketEntry/externalFilingEvents';

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
  const motionVisibilityChangeDate = createISODateString(
    '2027-01-01',
    'yyyy-MM-dd',
  );
  const beforeMotionVisibilityChangeDate = createISODateString(
    '2026-10-01',
    'yyyy-MM-dd',
  );
  const afterMotionVisibilityChangeDate = createISODateString(
    '2027-02-01',
    'yyyy-MM-dd',
  );
  const amendmentEventCodes = ['AMAT', 'ADMT', 'REDC', 'SPML', 'SUPM'];
  const baseDocketEntry: RawDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
    docketNumber: '123-45',
    documentStorageId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
    documentTitle: 'Some title',
    documentType: 'Stipulated Decision',
    entityName: 'DocketEntry',
    eventCode: 'SDEC',
    filers: [],
    filingDate: beforeVisibilityChangeDate,
    multiDocketedOn: [],
    isOnDocketRecord: true,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '',
    servedAt: '2018-11-21T20:49:28.192Z',
    stampData: {},
  };
  const supportingEventCodes = EXTERNAL_FILING_EVENTS[
    'Supporting Document'
  ].map(event => event.eventCode);

  describe.each([
    'DEC',
    ...['OCS', 'TCRP', 'ODL'],
    ...ORDER_EVENT_CODES,
    ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ])('Order, Opinion, and Decision Event Codes', eventCode => {
    it.each([
      beforeVisibilityChangeDate,
      afterVisibilityChangeDate,
      afterMotionVisibilityChangeDate,
    ])('is public before and after the visibility change', filingDate => {
      const isPublic = DocketEntry.isPublic(
        {
          ...baseDocketEntry,
          eventCode,
          filingDate,
        },
        {
          visibilityChangeDate,
          motionVisibilityChangeDate,
        },
      );

      expect(isPublic).toEqual(true);
    });

    it('is not public if it is not on the docket record', () => {
      const isPublic = DocketEntry.isPublic(
        {
          ...baseDocketEntry,
          eventCode,
          isOnDocketRecord: false,
        },
        { visibilityChangeDate, motionVisibilityChangeDate },
      );

      expect(isPublic).toEqual(false);
    });

    it('is not public if it is pending', () => {
      const isPublic = DocketEntry.isPublic(
        {
          ...baseDocketEntry,
          eventCode,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        },
        {
          visibilityChangeDate,
          motionVisibilityChangeDate,
        },
      );

      expect(isPublic).toEqual(false);
    });

    it('is not public if it is stricken', () => {
      const isPublic = DocketEntry.isPublic(
        {
          ...baseDocketEntry,
          eventCode,
          isStricken: true,
        },
        { visibilityChangeDate, motionVisibilityChangeDate },
      );

      expect(isPublic).toEqual(false);
    });

    it.each(supportingEventCodes)(
      'should return false for supporting of documents of a non-motion filing',
      supportingEventCode => {
        const isPublic = DocketEntry.isPublic(
          {
            ...baseDocketEntry,
            eventCode: supportingEventCode,
            filingDate: afterMotionVisibilityChangeDate,
          },
          {
            rootDocument: {
              ...baseDocketEntry,
              eventCode,
              filingDate: afterMotionVisibilityChangeDate,
            },
            visibilityChangeDate,
            motionVisibilityChangeDate,
          },
        );

        expect(isPublic).toBe(false);
      },
    );
  });

  describe('Documents impacted by Policy Date Change', () => {
    describe.each(POLICY_DATE_IMPACTED_EVENTCODES)(
      'before the visibility policy date change',
      eventCode => {
        it('is not public', () => {
          const isPublic = DocketEntry.isPublic(
            {
              ...baseDocketEntry,
              eventCode,
              filingDate: beforeVisibilityChangeDate,
            },
            {
              visibilityChangeDate,
              motionVisibilityChangeDate,
            },
          );
          expect(isPublic).toEqual(false);
        });
        it.each(supportingEventCodes)(
          'should return false for supporting of documents of a non-motion filing by an private practitioner',
          supportingEventCode => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: supportingEventCode,
                filingDate: beforeVisibilityChangeDate,
                filedByRole: ROLES.privatePractitioner,
              },
              {
                rootDocument: {
                  ...baseDocketEntry,
                  eventCode,
                  filingDate: beforeVisibilityChangeDate,
                  filedByRole: ROLES.privatePractitioner,
                },
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          },
        );
        it.each(supportingEventCodes)(
          'should return false for supporting of documents of a non-motion filing by an IRS practitioner',
          supportingEventCode => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: supportingEventCode,
                filingDate: beforeVisibilityChangeDate,
                filedByRole: ROLES.irsPractitioner,
              },
              {
                rootDocument: {
                  ...baseDocketEntry,
                  eventCode,
                  filingDate: beforeVisibilityChangeDate,
                  filedByRole: ROLES.irsPractitioner,
                },
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          },
        );
      },
    );

    describe.each([afterVisibilityChangeDate, afterMotionVisibilityChangeDate])(
      'after the visibility policy date change',
      filingDate => {
        const practitionerFiledBriefs = POLICY_DATE_IMPACTED_EVENTCODES.filter(
          eventCode =>
            ![...amendmentEventCodes, 'SDEC', 'AMBR'].includes(eventCode),
        );

        const practitionerRoles: string[] = [
          ROLES.privatePractitioner,
          ROLES.irsPractitioner,
        ];
        const otherRoles = Object.values(ROLES).filter(
          role => !practitionerRoles.includes(role),
        );

        describe.each(practitionerFiledBriefs)(
          'Practitioner-Filed Briefs',
          eventCode => {
            it('is not public if it is paper', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filedByRole: ROLES.privatePractitioner,
                  filingDate,
                  isPaper: true,
                },
                {
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toEqual(false);
            });

            it.each(practitionerRoles)(
              'is public if the filing party is a practitioner and it is electronically filed',
              filedByRole => {
                const isPublic = DocketEntry.isPublic(
                  { ...baseDocketEntry, eventCode, filedByRole, filingDate },
                  {
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toEqual(true);
              },
            );

            it.each(otherRoles)(
              'is not public if the filing party is not a practitioner and it is electronically filed',
              filedByRole => {
                const isPublic = DocketEntry.isPublic(
                  { ...baseDocketEntry, eventCode, filedByRole, filingDate },
                  {
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toEqual(false);
              },
            );

            it('is not public if the document is lodged', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filedByRole: ROLES.privatePractitioner,
                  filingDate,
                  lodged: true,
                },
                {
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toEqual(false);
            });
          },
        );

        describe.each(amendmentEventCodes)(
          'Amendments to Practitioner-Filed Briefs',
          eventCode => {
            // must be electronic
            // must be filed by Practitioner

            it('is not public if it is paper', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filedByRole: ROLES.privatePractitioner,
                  filingDate,
                  isPaper: true,
                },
                {
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toEqual(false);
            });

            it.each(practitionerRoles)(
              'is public if the filing party is a practitioner and it is electronically filed',
              filedByRole => {
                const isPublic = DocketEntry.isPublic(
                  {
                    ...baseDocketEntry,
                    eventCode,
                    filedByRole,
                    filingDate,
                  },
                  {
                    rootDocument: {
                      ...baseDocketEntry,
                      docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                      documentType: 'Seriatim Answering Brief',
                      filedByRole: ROLES.privatePractitioner,
                      isPaper: false,
                    },
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toEqual(true);
              },
            );

            it('is not public if the rootDocument was not filed by a Practitioner', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filedByRole: ROLES.privatePractitioner,
                  filingDate,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                    documentType: 'Seriatim Answering Brief',
                    filedByRole: ROLES.petitioner,
                    isPaper: false,
                  },

                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toEqual(false);
            });

            it.each(otherRoles)(
              'is not public if the filing party is not a practitioner',
              filedByRole => {
                const isPublic = DocketEntry.isPublic(
                  { ...baseDocketEntry, eventCode, filedByRole, filingDate },
                  {
                    rootDocument: {
                      ...baseDocketEntry,
                      docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
                      documentType: 'Seriatim Answering Brief',
                      filedByRole: ROLES.privatePractitioner,
                      isPaper: false,
                    },
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toEqual(false);
              },
            );

            it('is not public when the docket entry is an amended document that does not have a rootDocument', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filedByRole: ROLES.privatePractitioner,
                  filingDate,
                },
                {
                  rootDocument: undefined,
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toEqual(false);
            });
          },
        );

        describe.each(['SDEC', 'AMBR'])(
          'Amicus Briefs and Stip Decisions',
          eventCode => {
            it('is public', () => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode,
                  filingDate,
                },
                { visibilityChangeDate, motionVisibilityChangeDate },
              );

              expect(isPublic).toEqual(true);
            });
          },
        );

        describe.each(POLICY_DATE_IMPACTED_EVENTCODES)(
          'supprting documents for non-motion visibility policy imacted event codes',
          eventCode => {
            it.each(supportingEventCodes)(
              'should return false for supporting of documents of a non-motion filing by a private practitioner',
              supportingEventCode => {
                const isPublic = DocketEntry.isPublic(
                  {
                    ...baseDocketEntry,
                    eventCode: supportingEventCode,
                    filingDate,
                    filedByRole: ROLES.privatePractitioner,
                  },
                  {
                    rootDocument: {
                      ...baseDocketEntry,
                      eventCode,
                      filingDate,
                      filedByRole: ROLES.privatePractitioner,
                    },
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toBe(false);
              },
            );
            it.each(supportingEventCodes)(
              'should return false for supporting of documents of a non-motion filing by an IRS practitioner',
              supportingEventCode => {
                const isPublic = DocketEntry.isPublic(
                  {
                    ...baseDocketEntry,
                    eventCode: supportingEventCode,
                    filingDate,
                    filedByRole: ROLES.irsPractitioner,
                  },
                  {
                    rootDocument: {
                      ...baseDocketEntry,
                      eventCode,
                      filingDate,
                      filedByRole: ROLES.irsPractitioner,
                    },
                    visibilityChangeDate,
                    motionVisibilityChangeDate,
                  },
                );

                expect(isPublic).toBe(false);
              },
            );
          },
        );
      },
    );
  });

  const allOtherEventCodes = ALL_EVENT_CODES.filter(
    eventCode =>
      ![
        'DEC',
        ...['OCS', 'TCRP', 'ODL'],
        ...ORDER_EVENT_CODES,
        ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        ...POLICY_DATE_IMPACTED_EVENTCODES,
        ...MOTION_EVENT_CODES,
      ].includes(eventCode),
  );

  describe.each(allOtherEventCodes)('All other Documents', eventCode => {
    describe.each([
      ROLES.petitioner,
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
    ])('For external roles', role => {
      it.each([
        beforeVisibilityChangeDate,
        afterVisibilityChangeDate,
        afterMotionVisibilityChangeDate,
      ])('is not public before and after visibility changes', filingDate => {
        const isPublic = DocketEntry.isPublic(
          {
            ...baseDocketEntry,
            eventCode,
            filingDate,
            filedByRole: role,
          },
          { visibilityChangeDate, motionVisibilityChangeDate },
        );

        expect(isPublic).toEqual(false);
      });
      it.each(supportingEventCodes)(
        'should return false for supporting of documents of a non-motion filing',
        supportingEventCode => {
          const isPublic = DocketEntry.isPublic(
            {
              ...baseDocketEntry,
              eventCode: supportingEventCode,
              filingDate: afterMotionVisibilityChangeDate,
              filedByRole: role,
            },
            {
              rootDocument: {
                ...baseDocketEntry,
                eventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
              },
              visibilityChangeDate,
              motionVisibilityChangeDate,
            },
          );

          expect(isPublic).toBe(false);
        },
      );
    });
  });

  describe.each(MOTION_EVENT_CODES)('Motion Visibility', motionEventCode => {
    describe('Before motion visibility change date', () => {
      describe.each([ROLES.privatePractitioner, ROLES.irsPractitioner])(
        'Practitioners file motions and supporting documents',
        role => {
          it(`should return false for motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: beforeMotionVisibilityChangeDate,
                filedByRole: role,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: beforeMotionVisibilityChangeDate,
                  filedByRole: role,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: beforeMotionVisibilityChangeDate,
                    filedByRole: role,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
        },
      );
    });
    describe('After motion visibility change date', () => {
      describe.each([ROLES.privatePractitioner, ROLES.irsPractitioner])(
        'Practitioners file motions and supporting documents',
        role => {
          it(`should return true for motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(true);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return true for briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(true);
            },
          );
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for briefs or memoranda in support of a motion filed by a ${role} after the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: createISODateString('2027-03-01', 'yyyy-MM-dd'),
                  filedByRole: role,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it.each(
            supportingEventCodes.filter(
              eventCode =>
                !PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS.includes(eventCode),
            ),
          )(
            `should return false for other supporting documents of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it('should return false for motions that are paper filed', () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: true,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            'should return false for briefs or memoranda filed in support that are paper filed',
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: true,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it(`should return false for lodged motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                lodged: true,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for briefs or memoranda in support of a lodged motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                    isPaper: false,
                    lodged: true,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for lodged briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                  lodged: true,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                    isPaper: false,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it(`should return false for other supporting documents of a lodged motion filed by a ${role} at the same time as the motion`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: 'EXH',
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
              },
              {
                rootDocument: {
                  ...baseDocketEntry,
                  eventCode: motionEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                  lodged: true,
                },
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it(`should return false for stricken motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                isStricken: true,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for stricken briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                  isStricken: true,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                    isPaper: false,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it(`should return false for sealed motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                isSealed: true,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it(`should return false for legacy sealed motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                isLegacySealed: true,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for sealed briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                  isSealed: true,
                },
                {
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                    isPaper: false,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it(`should return false for motions filed by a ${role} when the case is sealed`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
              },
              {
                caseIsSealed: true,
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
            `should return false for briefs or memoranda in support of a motion filed by a ${role} at the same time as the motion when the case is sealed`,
            supportingEventCode => {
              const isPublic = DocketEntry.isPublic(
                {
                  ...baseDocketEntry,
                  eventCode: supportingEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                },
                {
                  caseIsSealed: true,
                  rootDocument: {
                    ...baseDocketEntry,
                    eventCode: motionEventCode,
                    filingDate: afterMotionVisibilityChangeDate,
                    filedByRole: role,
                    isPaper: false,
                  },
                  visibilityChangeDate,
                  motionVisibilityChangeDate,
                },
              );

              expect(isPublic).toBe(false);
            },
          );
          it(`should return false for unserved motions filed by a ${role}`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                servedAt: undefined,
              },
              {
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
          it(`should return false for unserved briefs in support of a motion filed by a ${role} at the same time as the motion`, () => {
            const isPublic = DocketEntry.isPublic(
              {
                ...baseDocketEntry,
                eventCode: 'BRF',
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: role,
                isPaper: false,
                servedAt: undefined,
              },
              {
                rootDocument: {
                  ...baseDocketEntry,
                  eventCode: motionEventCode,
                  filingDate: afterMotionVisibilityChangeDate,
                  filedByRole: role,
                  isPaper: false,
                },
                visibilityChangeDate,
                motionVisibilityChangeDate,
              },
            );

            expect(isPublic).toBe(false);
          });
        },
      );
      it('should return false for motions filed by a petitioner', () => {
        const isPublic = DocketEntry.isPublic(
          {
            ...baseDocketEntry,
            eventCode: motionEventCode,
            filingDate: afterMotionVisibilityChangeDate,
            filedByRole: ROLES.petitioner,
          },
          {
            visibilityChangeDate,
            motionVisibilityChangeDate,
          },
        );

        expect(isPublic).toBe(false);
      });
      it.each(PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS)(
        'should return false for briefs or memoranda in support of a motion filed by a petitioner at the same time as the motion',
        supportingEventCode => {
          const isPublic = DocketEntry.isPublic(
            {
              ...baseDocketEntry,
              eventCode: supportingEventCode,
              filingDate: afterMotionVisibilityChangeDate,
              filedByRole: ROLES.petitioner,
            },
            {
              rootDocument: {
                ...baseDocketEntry,
                eventCode: motionEventCode,
                filingDate: afterMotionVisibilityChangeDate,
                filedByRole: ROLES.petitioner,
              },
              visibilityChangeDate,
              motionVisibilityChangeDate,
            },
          );

          expect(isPublic).toBe(false);
        },
      );
    });
  });

  describe('Lodged root: motion filings vs non-motion filings', () => {
    it('when the lodged root is a practitioner brief, not a motion, related entries keep their usual public visibility', () => {
      const isPublic = DocketEntry.isPublic(
        {
          ...baseDocketEntry,
          eventCode: 'AMAT',
          filedByRole: ROLES.privatePractitioner,
          filingDate: afterVisibilityChangeDate,
          isPaper: false,
        },
        {
          rootDocument: {
            ...baseDocketEntry,
            docketEntryId: '2a389787-91d2-41ba-9c6e-2a13440a928b',
            documentType: 'Seriatim Answering Brief',
            filedByRole: ROLES.privatePractitioner,
            filingDate: afterVisibilityChangeDate,
            isPaper: false,
            lodged: true,
          },
          visibilityChangeDate,
          motionVisibilityChangeDate,
        },
      );

      expect(isPublic).toBe(true);
    });
  });
});
