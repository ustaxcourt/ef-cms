import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from './DocketEntry';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';

const baseDocketEntry: RawDocketEntry = {
  ...MOCK_DOCUMENTS[0],
  servedAt: '2018-11-21T20:49:28.192Z',
};

describe('isDownloadable', () => {
  describe('Court User', () => {
    it('returns false if there is no file attached', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: false,
          },
          {
            isCourtUser: true,
          },
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
          {
            isCourtUser: true,
          },
        ),
      ).toEqual(true);
    });
  });

  describe('External with no have access to the case', () => {
    const options = {
      isCourtUser: false,
      isPublic: true,
      userHasAccessToCase: false,
    };

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

    it('returns false if the document is not Public', () => {
      expect(
        DocketEntry.isDownloadable(
          {
            ...baseDocketEntry,
            isFileAttached: true,
          },
          {
            ...options,
            isPublic: false,
          },
        ),
      ).toEqual(false);
    });
  });

  describe('External user with access to the case', () => {
    const isTranscriptOldEnoughToUnseal = jest.spyOn(
      DocketEntry,
      'isTranscriptOldEnoughToUnseal',
    );

    beforeEach(() => {
      isTranscriptOldEnoughToUnseal.mockReturnValue(true);
    });

    const options = {
      isCourtUser: false,
      isPublic: false,
      userHasAccessToCase: true,
    };

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
      expect(
        DocketEntry.isDownloadable(baseDocketEntry, {
          ...options,
          isPublic: true,
        }),
      ).toEqual(true);
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
          expect(
            DocketEntry.isDownloadable(
              {
                ...baseDocketEntry,
                eventCode: UNSERVABLE_EVENT_CODES[0],
                servedAt: undefined,
              },
              {
                ...options,
                isPublic: true,
              },
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
});
