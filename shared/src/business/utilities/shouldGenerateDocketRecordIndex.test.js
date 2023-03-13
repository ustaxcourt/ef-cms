import { shouldGenerateDocketRecordIndex } from './shouldGenerateDocketRecordIndex';

describe('shouldGenerateDocketRecordIndex', () => {
  it('returns false for any entry that already has an index', () => {
    const caseDetail = { docketEntries: [] };
    const docketEntry = {
      docketEntryId: '123',
      index: 1,
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('returns false for entries without a document', () => {
    // are there exceptions to this? entries without a document
    const caseDetail = { docketEntries: [] };
    const docketEntry = {
      documentType: 'Answer',
      eventCode: 'A',
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('returns true for electronically filed non court issued documents', () => {
    const caseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          isPaper: false,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Answer',
      eventCode: 'A',
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });

  it('returns false for electronically filed court issued documents', () => {
    const caseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          isPaper: false,
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Answer',
      eventCode: 'O',
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('returns true for petition documents', () => {
    const caseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          isPaper: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Petition',
      eventCode: 'P',
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });

  it('should return false for STIN', () => {
    const caseDetail = {
      docketEntries: [
        {
          createdAt: '2019-03-01T21:40:46.415Z',
          docketEntryId: '012',
          eventCode: 'P',
          isPaper: true,
        },
        {
          docketEntryId: '123',
          isPaper: true,
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Statement of Taxpayer Identification',
      eventCode: 'STIN',
      filingDate: '2019-03-01T21:40:56.415Z', // 10 seconds
      isPaper: true,
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('should return true for non-STIN initial document types filed along with the petition', () => {
    const caseDetail = {
      docketEntries: [
        {
          createdAt: '2019-03-01T21:40:46.415Z',
          docketEntryId: '012',
          eventCode: 'P',
          isPaper: true,
        },
        {
          docketEntryId: '123',
          isPaper: true,
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Corporate Disclosure Statement',
      eventCode: 'DISC',
      filingDate: '2019-03-01T21:40:56.415Z', // 10 seconds
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });

  it('returns true for initial document types filed after the petition if the document is being served', () => {
    const caseDetail = {
      docketEntries: [
        {
          createdAt: '2019-03-01T21:40:46.415Z',
          docketEntryId: '012',
          eventCode: 'P',
          isPaper: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        {
          docketEntryId: '123',
          isPaper: true,
          servedAt: '2019-03-02T21:40:46.415Z',
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Corporate Disclosure Statement',
      eventCode: 'DISC',
      filingDate: '2019-03-01T21:40:57.415Z',
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });
    expect(result).toEqual(true);
  });

  it('returns false for initial document types filed after the petition if the document is NOT being served', () => {
    const caseDetail = {
      docketEntries: [
        {
          createdAt: '2019-03-01T21:40:46.415Z',
          docketEntryId: '012',
          eventCode: 'P',
          isPaper: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Corporate Disclosure Statement',
      eventCode: 'DISC',
      filingDate: '2019-03-01T21:40:57.415Z',
      isPaper: true,
    };
    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('returns true for documents that are unservable', () => {
    const caseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          isPaper: true,
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Hearing before',
      eventCode: 'HEAR',
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });

  it('returns true for minute entries', () => {
    const caseDetail = { docketEntries: [] };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Filing Fee Paid',
      eventCode: 'FEE',
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });

  it('returns false for servable documents that are not served', () => {
    const caseDetail = {
      docketEntries: [],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Answer',
      eventCode: 'A',
      isPaper: true,
      servedAt: undefined,
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(false);
  });

  it('returns true for servable documents that are served', () => {
    const caseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          isPaper: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ],
    };
    const docketEntry = {
      docketEntryId: '123',
      documentType: 'Answer',
      eventCode: 'A',
    };

    const result = shouldGenerateDocketRecordIndex({
      caseDetail,
      docketEntry,
    });

    expect(result).toEqual(true);
  });
});
