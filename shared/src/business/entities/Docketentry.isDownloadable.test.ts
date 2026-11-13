import {
  CASE_STATUS_TYPES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
  STIN_DOCKET_ENTRY_TYPE,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from './DocketEntry';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  casePetitioner,
  caseServicesSupervisorUser,
  docketClerk1User,
  irsSuperuserUser,
  petitionerUser,
} from '@shared/test/mockUsers';
import { cloneDeep } from 'lodash';
import { getPetitionDocketEntry } from './cases/Case';

let baseDocketEntry: RawDocketEntry;
let rawCase: RawCase;
const visibilityChangeDate = '2018-11-21T20:49:28.192Z';
const motionVisibilityChangeDate = '2027-01-01T00:00:00.000Z';
const afterMotionVisibilityChangeDate = calculateISODate({
  dateString: motionVisibilityChangeDate,
  howMuch: 1,
  units: 'days',
});

describe('isDownloadable', () => {
  const isPublic = jest.spyOn(DocketEntry, 'isPublic');

  beforeEach(() => {
    isPublic.mockReset();

    rawCase = cloneDeep(MOCK_CASE);
    rawCase.status = CASE_STATUS_TYPES.generalDocket;
    rawCase.docketEntries[0].servedAt = '2018-11-21T20:49:28.192Z';
    baseDocketEntry = rawCase.docketEntries[0];
  });

  describe('Court User', () => {
    let options;
    beforeEach(() => {
      options = {
        isTerminalUser: false,
        rawCase,
        user: docketClerk1User,
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };
    });

    it('returns false if there is no file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: false,
          },
          options,
        ),
      ).toEqual(false);
    });

    it('returns true if there is a file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: true,
          },
          options,
        ),
      ).toEqual(true);
    });
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

    it('returns false if there is no file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: false,
          },
          options,
        ),
      ).toEqual(false);
    });

    it('returns true if the document is Public', () => {
      isPublic.mockReturnValueOnce(true);
      expect(DocketEntry.isDownloadable(baseDocketEntry, options)).toEqual(
        true,
      );
    });

    it('returns false if the document is not Public', () => {
      isPublic.mockReturnValueOnce(false);
      expect(DocketEntry.isDownloadable(baseDocketEntry, options)).toEqual(
        false,
      );
    });

    it('should pass proper options to isPublic', () => {
      const entry = {
        ...baseDocketEntry,
        isFileAttached: true,
      };
      DocketEntry.isDownloadable(entry, options);

      expect(isPublic).toHaveBeenLastCalledWith(entry, {
        caseIsSealed: false,
        rootDocument: DocketEntry.fetchRootDocument(
          baseDocketEntry,
          rawCase.docketEntries,
        ),
        visibilityChangeDate,
        motionVisibilityChangeDate,
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
      isTranscriptOldEnoughToUnseal.mockReturnValue(true);
    });

    const isTranscriptOldEnoughToUnseal = jest.spyOn(
      DocketEntry,
      'isTranscriptOldEnoughToUnseal',
    );

    it('returns false if there is no file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: false,
          },
          options,
        ),
      ).toEqual(false);
    });

    it('returns true if the document is Public', () => {
      isPublic.mockReturnValueOnce(true);
      expect(DocketEntry.isDownloadable(baseDocketEntry, options)).toEqual(
        true,
      );
    });

    it('returns false if it is sealed to external', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          },
          options,
        ),
      ).toEqual(false);
    });

    describe('not served', () => {
      it('returns false if the document is servable', () => {
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              eventCode: 'DEC',
              servedAt: undefined,
            },
            options,
          ),
        ).toEqual(false);
      });

      ['P', 'ATP', 'DISC'].forEach(eventCode => {
        it(`should return "true" if the document is servable and user is a "Petitioner" that submitted "${eventCode}" docket entry`, () => {
          const TEST_USER_ID = 'TEST_USER_ID';
          options.user.userId = TEST_USER_ID;
          options.user.role = ROLES.petitioner;
          options.rawCase.leadDocketNumber = undefined;
          options.rawCase.petitioners = [{ contactId: TEST_USER_ID }];
          const restults = DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              eventCode,
              filers: [TEST_USER_ID],
              servedAt: undefined,
            },
            options,
          );

          expect(restults).toEqual(true);
        });
      });

      ['P', 'ATP', 'DISC'].forEach(eventCode => {
        it(`should return "true" if the document is servable and user is a "Private Practitioner" that submitted "${eventCode}" docket entry`, () => {
          const TEST_USER_ID = 'TEST_USER_ID';
          options.user.userId = TEST_USER_ID;
          options.user.role = ROLES.privatePractitioner;
          options.rawCase.leadDocketNumber = undefined;
          options.rawCase.petitioners = [{ contactId: TEST_USER_ID }];
          const restults = DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              eventCode,
              servedAt: undefined,
              userId: TEST_USER_ID,
            },
            options,
          );

          expect(restults).toEqual(true);
        });
      });

      describe('unservable', () => {
        it('returns true if the document is public', () => {
          isPublic.mockReturnValueOnce(true);
          expect(
            DocketEntry.isDownloadable(
              {
                ...baseDocketEntry,
                eventCode: UNSERVABLE_EVENT_CODES[0],
                servedAt: undefined,
              },
              options,
            ),
          ).toEqual(true);
        });

        describe('not public', () => {
          it('returns true if the document is sealed', () => {
            expect(
              DocketEntry.isDownloadable(
                {
                  ...baseDocketEntry,
                  eventCode: UNSERVABLE_EVENT_CODES[0],
                  isSealed: true,
                  servedAt: undefined,
                },
                options,
              ),
            ).toEqual(true);
          });

          it('returns true if the document is not sealed', () => {
            expect(
              DocketEntry.isDownloadable(
                {
                  ...baseDocketEntry,
                  eventCode: UNSERVABLE_EVENT_CODES[0],
                  isSealed: undefined,
                  servedAt: undefined,
                },
                options,
              ),
            ).toEqual(true);
          });

          it('returns false if the document does not meet age requirement', () => {
            isTranscriptOldEnoughToUnseal.mockReturnValue(false);
            expect(
              DocketEntry.isDownloadable(
                {
                  ...baseDocketEntry,
                  date: 'something',
                  eventCode: 'TRAN',
                  isSealed: undefined,
                  servedAt: undefined,
                },
                options,
              ),
            ).toEqual(false);
          });

          it('returns true if the document meets age requirement', () => {
            isTranscriptOldEnoughToUnseal.mockReturnValue(true);
            expect(
              DocketEntry.isDownloadable(
                {
                  ...baseDocketEntry,
                  date: 'something',
                  eventCode: 'TRAN',
                  isSealed: undefined,
                  servedAt: undefined,
                },
                options,
              ),
            ).toEqual(true);
          });
        });
      });
    });

    describe('served', () => {
      it('returns true', () => {
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              servedAt: '2023-01-03T00:00:01.000Z',
            },
            options,
          ),
        ).toEqual(true);
      });

      it('returns false if the document is stricken', () => {
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              isStricken: true,
              servedAt: '2023-01-03T00:00:01.000Z',
            },
            options,
          ),
        ).toEqual(false);
      });

      it('returns false if the document is sealed to external', () => {
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
              servedAt: '2023-01-03T00:00:01.000Z',
            },
            options,
          ),
        ).toEqual(false);
      });

      it('returns false if the document does not meet age requirement', () => {
        isTranscriptOldEnoughToUnseal.mockReturnValue(false);
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              date: 'something',
              eventCode: 'TRAN',
              isSealed: undefined,
              servedAt: undefined,
            },
            options,
          ),
        ).toEqual(false);
      });

      it('returns true if the document meets age requirement', () => {
        isTranscriptOldEnoughToUnseal.mockReturnValue(true);
        expect(
          DocketEntry.isDownloadable(
            {
              ...baseDocketEntry,
              date: 'something',
              eventCode: 'TRAN',
              isSealed: undefined,
              servedAt: undefined,
            },
            options,
          ),
        ).toEqual(true);
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

    it('returns true if the document is Public', () => {
      isPublic.mockReturnValueOnce(true);
      expect(DocketEntry.isDownloadable(baseDocketEntry, options)).toEqual(
        true,
      );
    });

    it('returns true if the document is not Public', () => {
      isPublic.mockReturnValueOnce(false);
      expect(DocketEntry.isDownloadable(baseDocketEntry, options)).toEqual(
        true,
      );
    });

    it('returns false if the document is sealed', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isSealed: true,
          },
          options,
        ),
      ).toEqual(false);
    });

    it('returns false if the document is stricken', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isStricken: true,
          },
          options,
        ),
      ).toEqual(false);
    });

    describe('lodged practitioner motion after motion visibility change date', () => {
      const lodgedPractitionerMotion: RawDocketEntry = {
        ...baseDocketEntry,
        eventCode: 'M006',
        filingDate: afterMotionVisibilityChangeDate,
        filedByRole: ROLES.privatePractitioner,
        isFileAttached: true,
        isOnDocketRecord: true,
        isPaper: false,
        lodged: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: afterMotionVisibilityChangeDate,
      };

      it('returns true for a terminal user without relying on isPublic', () => {
        expect(
          DocketEntry.isDownloadable(lodgedPractitionerMotion, options),
        ).toEqual(true);
        expect(isPublic).not.toHaveBeenCalled();
      });

      it('returns false for a public user without case access because the motion is not public', () => {
        expect(
          DocketEntry.isDownloadable(lodgedPractitionerMotion, {
            ...options,
            isTerminalUser: false,
            user: petitionerUser,
          }),
        ).toEqual(false);
      });
    });
  });

  describe('IRS Superuser', () => {
    let options;
    let petitionDocketEntry;
    beforeEach(() => {
      petitionDocketEntry = getPetitionDocketEntry(rawCase);
      options = {
        isTerminalUser: false,
        rawCase,
        user: irsSuperuserUser,
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };
    });

    it('returns false if there is no file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: false,
          },
          options,
        ),
      ).toEqual(false);
    });

    it('returns true if there is a file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: true,
          },
          options,
        ),
      ).toEqual(true);
    });

    it('returns true if there is a file attached and is event code is STIN', () => {
      expect(petitionDocketEntry).toBeDefined();
      expect(DocketEntry.isServed(petitionDocketEntry)).toEqual(true);

      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
            isFileAttached: true,
          },
          options,
        ),
      ).toEqual(true);
    });
  });

  describe('Case Services Supervisor', () => {
    let options;
    let petitionDocketEntry;
    beforeEach(() => {
      petitionDocketEntry = getPetitionDocketEntry(rawCase);
      options = {
        isTerminalUser: false,
        rawCase,
        user: caseServicesSupervisorUser,
        visibilityChangeDate,
        motionVisibilityChangeDate,
      };
    });

    it('returns true if event code is STIN and is not served', () => {
      expect(petitionDocketEntry).toBeDefined();
      petitionDocketEntry.servedAt = undefined;
      expect(DocketEntry.isServed(petitionDocketEntry)).toEqual(false);

      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
          },
          options,
        ),
      ).toEqual(true);
    });

    it('returns false if event code is STIN and is served', () => {
      expect(petitionDocketEntry).toBeDefined();
      expect(DocketEntry.isServed(petitionDocketEntry)).toEqual(true);

      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
          },
          options,
        ),
      ).toEqual(false);
    });
  });
});
