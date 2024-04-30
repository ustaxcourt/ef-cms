import {
  CASE_STATUS_TYPES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from './DocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  casePetitioner,
  docketClerk1User,
  petitionerUser,
} from '@shared/test/mockUsers';
import { cloneDeep } from 'lodash';

let baseDocketEntry: RawDocketEntry;
let rawCase: RawCase;
const visibilityChangeDate = '2018-11-21T20:49:28.192Z';

describe('isDownloadable', () => {
  const isPublic = jest.spyOn(DocketEntry, 'isPublic');

  beforeEach(() => {
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
  });
});
