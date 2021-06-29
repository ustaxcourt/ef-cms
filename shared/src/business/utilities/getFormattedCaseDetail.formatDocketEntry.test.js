const {
  applicationContext,
} = require('../../../../web-client/src/applicationContext');
const {
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} = require('../entities/EntityConstants');
const { formatDocketEntry } = require('./getFormattedCaseDetail');

describe('formatDocketEntry', () => {
  it('should format the servedAt date', () => {
    const results = formatDocketEntry(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
    });

    expect(results).toMatchObject({
      servedAtFormatted: '03/27/19',
    });
  });

  it('should format only lodged documents with overridden eventCode MISCL', () => {
    const result = formatDocketEntry(applicationContext, {
      docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
      documentType: 'Motion for Leave to File Administrative Record',
      eventCode: 'M115',
      lodged: true,
    });

    expect(result.eventCode).toEqual('MISCL');
  });

  it('should return isTranscript true for transcript documents', () => {
    const result = formatDocketEntry(applicationContext, {
      docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
      documentType: 'Transcript',
      eventCode: TRANSCRIPT_EVENT_CODE,
    });

    expect(result.isTranscript).toEqual(true);
  });

  it('should return isStipDecision true for stipulated decision documents', () => {
    const result = formatDocketEntry(applicationContext, {
      docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
      documentType: 'Stipulated Decision',
      eventCode: STIPULATED_DECISION_EVENT_CODE,
    });

    expect(result.isStipDecision).toEqual(true);
  });

  it('should return isTranscript and isStipDecision false for non-transcript documents', () => {
    const result = formatDocketEntry(applicationContext, {
      docketEntryId: '5d96bdfd-dc10-40db-b640-ef10c2591b6a',
      documentType: 'Answer',
      eventCode: 'A',
    });

    expect(result.isTranscript).toEqual(false);
    expect(result.isStipDecision).toEqual(false);
  });

  it('should set isCourtIssuedDocument to false when document.eventCode is not present in the list of court issued documents', () => {
    const results = formatDocketEntry(applicationContext, {
      eventCode: 'PMT',
    });

    expect(results.isCourtIssuedDocument).toBeFalsy();
  });

  describe('isInProgress', () => {
    it('should return isInProgress true if the document is not court-issued, not a minute entry, does not have a file attached, and is not unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'A', //not unservable, not court-issued
        isFileAttached: false,
        isMinuteEntry: false,
      });

      expect(results.isInProgress).toEqual(true);
    });

    it('should return isInProgress true if the document has a file attached and is not served or unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'A', //not unservable
        isFileAttached: true,
      });

      expect(results.isInProgress).toEqual(true);
    });

    it('should return isInProgress false if the document is court-issued', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'O', //court-issued
      });

      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document has a file attached and is served', () => {
      const results = formatDocketEntry(applicationContext, {
        isFileAttached: true,
        servedAt: '2019-03-01T21:40:46.415Z',
      });

      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document has a file attached and is unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'CTRA', //unservable
        isFileAttached: true,
      });

      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document is a minute entry', () => {
      const results = formatDocketEntry(applicationContext, {
        isMinuteEntry: true,
      });

      expect(results.isInProgress).toEqual(false);
    });

    it('should return isInProgress false if the document is unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'CTRA', //unservable
      });

      expect(results.isInProgress).toEqual(false);
    });
  });
});
