import {
  CORRECTED_TRANSCRIPT_EVENT_CODE,
  REVISED_TRANSCRIPT_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';

describe('isTranscriptOldEnoughToUnseal', () => {
  const oldTranscriptDate = '2010-01-01T01:02:03.007Z';
  const aShortTimeAgo = calculateISODate({
    dateString: createISODateString(),
    howMuch: -12,
    units: 'hours',
  });

  it('indicates success if document is not a transcript', () => {
    const nonTranscriptEventCode = 'BANANA'; // this is not a transcript event code - to think otherwise would just be bananas.
    const result = DocketEntry.isTranscriptOldEnoughToUnseal({
      eventCode: nonTranscriptEventCode,
    });

    expect(result).toBeTruthy();
  });

  [
    TRANSCRIPT_EVENT_CODE,
    CORRECTED_TRANSCRIPT_EVENT_CODE,
    REVISED_TRANSCRIPT_EVENT_CODE,
  ].forEach(transcript => {
    it(`indicates success if document is a ${transcript} transcript aged more than ${DocketEntry.TRANSCRIPT_AGE_DAYS_MIN} days`, () => {
      const result = DocketEntry.isTranscriptOldEnoughToUnseal({
        date: oldTranscriptDate,
        eventCode: transcript,
      });

      expect(result).toBeTruthy();
    });

    it(`indicates success if document is a legacy ${transcript} transcript aged more than ${DocketEntry.TRANSCRIPT_AGE_DAYS_MIN} days using filingDate`, () => {
      const result = DocketEntry.isTranscriptOldEnoughToUnseal({
        date: undefined,
        eventCode: transcript,
        filingDate: oldTranscriptDate,
        isLegacy: true,
      });

      expect(result).toBeTruthy();
    });

    it(`indicates failure if document is a legacy ${transcript} transcript aged less than ${DocketEntry.TRANSCRIPT_AGE_DAYS_MIN} days using filingDate`, () => {
      const result = DocketEntry.isTranscriptOldEnoughToUnseal({
        date: undefined,
        eventCode: transcript,
        filingDate: aShortTimeAgo,
        isLegacy: true,
      });

      expect(result).toBeFalsy();
    });

    it(`indicates failure if document is a ${transcript} transcript aged less than ${DocketEntry.TRANSCRIPT_AGE_DAYS_MIN} days`, () => {
      const result = DocketEntry.isTranscriptOldEnoughToUnseal({
        date: aShortTimeAgo,
        eventCode: transcript,
      });

      expect(result).toBeFalsy();
    });
  });
});
