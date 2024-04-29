import {
  MINUTE_ENTRIES_MAP,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../entities/EntityConstants';
import { applicationContext } from '../../../../web-client/src/applicationContext';
import { formatDocketEntry } from './getFormattedCaseDetail';

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

  it('should format certificate of service date', () => {
    const result = formatDocketEntry(applicationContext, {
      certificateOfServiceDate: '2019-04-27T21:53:00.297Z',
      createdAt: '2019-05-27T21:53:00.297Z',
      docketEntryId: 'd-1-2-3',
      documentType: 'Petition',
      index: '1',
      servedAt: '2019-06-27T21:53:00.297Z',
    });

    expect(result.certificateOfServiceDateFormatted).toEqual('04/27/19');
  });

  it('should correctly format legacy served docket entries', () => {
    const result = formatDocketEntry(applicationContext, {
      isLegacyServed: true,
    });

    expect(result.isNotServedDocument).toBeFalsy();
    expect(result.isUnservable).toBeTruthy();
  });

  describe('isNotServedDocument', () => {
    it('should be true when isLegacyServed and servedAt are undefined and document is not a minute entry', () => {
      const result = formatDocketEntry(applicationContext, {
        eventCode: 'A',
        isLegacyServed: undefined,
        servedAt: undefined,
      });

      expect(result.isNotServedDocument).toBe(true);
    });

    it('should be false when isLegacyServed is true, servedAt are undefined, and document is not a minute entry', () => {
      const result = formatDocketEntry(applicationContext, {
        eventCode: 'A',
        isLegacyServed: true,
        servedAt: undefined,
      });

      expect(result.isNotServedDocument).toBe(false);
    });

    it('should be false when isLegacyServed and servedAt are undefined and the document is a minute entry', () => {
      const result = formatDocketEntry(applicationContext, {
        eventCode:
          MINUTE_ENTRIES_MAP[Object.keys(MINUTE_ENTRIES_MAP)[0]].eventCode,
        isLegacyServed: undefined,
        servedAt: undefined,
      });

      expect(result.isNotServedDocument).toBe(false);
    });

    it('should be false when servedAt is defined and isLegacyServed and is not a minute entry', () => {
      const result = formatDocketEntry(applicationContext, {
        eventCode: 'A',
        isLegacyServed: undefined,
        servedAt: '2019-06-27T21:53:00.297Z',
      });

      expect(result.isNotServedDocument).toBe(false);
    });
  });

  describe('isInProgress', () => {
    it('should return isInProgress true if the document is not court-issued, not a minute entry, does not have a file attached, and is not unservable', () => {
      const results = formatDocketEntry(applicationContext, {
        eventCode: 'A', //not unservable, not court-issued, not minute entry
        isFileAttached: false,
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
        eventcode: 'RQT', // minute entry
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

  describe('qcNeeded', () => {
    it('should be true for a docket entry that is not in-progress and has an incomplete work item', () => {
      const result = formatDocketEntry(applicationContext, {
        isFileAttached: true,
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: '2019-03-01T21:40:46.415Z',
        workItem: {
          completedAt: undefined,
          isRead: false,
        },
      });
      expect(result.qcNeeded).toBeTruthy();
    });

    it('should be false for a docket entry that is in-progress and has an incomplete work item', () => {
      const result = formatDocketEntry(applicationContext, {
        isFileAttached: false,
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: '2019-03-01T21:40:46.415Z',
        workItem: {
          completedAt: undefined,
          isRead: false,
        },
      });

      expect(result.qcNeeded).toBeFalsy();
    });

    it('should be false for a docket entry that is not in-progress and does not have an incomplete work item', () => {
      const result = formatDocketEntry(applicationContext, {
        isFileAttached: true,
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: '2019-03-01T21:40:46.415Z',
      });

      expect(result.qcNeeded).toBeFalsy();
    });
  });

  describe('createdAtFormatted', () => {
    const createdAtFormattedTests = [
      {
        description:
          'should format docket entries and set createdAtFormatted to the formatted filingDate if document is not a court-issued document',
        docketEntry: {
          createdAt: '2019-03-11T17:29:13.120Z',
          docketEntryId: '47d9735b-ac41-4adf-8a3c-74d73d3622fb',
          documentType: 'Petition',
          filingDate: '2019-04-19T17:29:13.120Z',
          index: '1',
          isOnDocketRecord: true,
        },
        expectation: '04/19/19',
      },
      {
        description:
          'should format docket records and set createdAtFormatted to empty string if document is an unserved court-issued document',
        docketEntry: {
          documentTitle: 'Order [Judge Name] [Anything]',
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          filingDate: '2019-04-19T17:29:13.120Z',
        },
        expectation: '',
      },
      {
        description:
          'should be a formatted date string using the filingDate if the document is on the docket record and is served',
        docketEntry: {
          createdAt: '2019-03-11T17:29:13.120Z',
          filingDate: '2019-04-19T17:29:13.120Z',
          isOnDocketRecord: true,
          servedAt: '2019-06-19T17:29:13.120Z',
        },
        expectation: '04/19/19',
      },
      {
        description:
          'should be a formatted date string using the filingDate if the document is on the docket record and is an unserved external document',
        docketEntry: {
          createdAt: '2019-03-11T17:29:13.120Z',
          filingDate: '2019-04-19T17:29:13.120Z',
          isOnDocketRecord: true,
          servedAt: undefined,
        },
        expectation: '04/19/19',
      },
      {
        description:
          'should be empty string if the document is on the docket record and is an unserved court-issued document',
        docketEntry: {
          createdAt: '2019-03-11T17:29:13.120Z',
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          filingDate: '2019-04-19T17:29:13.120Z',
          isOnDocketRecord: true,
          servedAt: undefined,
        },
        expectation: '',
      },
    ];

    createdAtFormattedTests.forEach(
      ({ description, docketEntry, expectation }) => {
        it(`${description}`, () => {
          const result = formatDocketEntry(applicationContext, docketEntry);

          expect(result.createdAtFormatted).toEqual(expectation);
        });
      },
    );
  });
});
