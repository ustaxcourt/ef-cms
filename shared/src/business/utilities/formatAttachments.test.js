import { formatAttachments } from './formatAttachments';

describe('formatAttachments', () => {
  const mockDocuments = [
    {
      documentId: '1',
      documentTitle: 'Test Document One',
    },
    {
      documentId: '2',
      documentType: 'Test Document Two',
    },
  ];

  const mockCorrespondenceDocuments = [
    {
      documentId: '3',
      documentTitle: 'Test Correspondence One',
    },
    {
      documentId: '4',
      documentType: 'Test Correspondence Two',
    },
  ];

  const mockArchivedDocuments = [
    {
      archived: true,
      documentId: '5',
      documentTitle: 'Test Archived One',
    },
    {
      archived: true,
      documentId: '6',
      documentType: 'Test Archived Two',
    },
  ];

  const mockArchivedCorrespondenceDocuments = [
    {
      archived: true,
      documentId: '7',
      documentTitle: 'Test Archived Correspondence One',
    },
    {
      archived: true,
      documentId: '8',
      documentType: 'Test Archived Correspondence Two',
    },
  ];

  it('formats documents in the attachments array based on meta from documents in the documents, correspondence, archivedDocuments, and archivedCorrespondences arrays', () => {
    const result = formatAttachments({
      attachments: [
        { documentId: '1' },
        { documentId: '3' },
        { documentId: '5' },
        { documentId: '7' },
      ],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocuments: mockArchivedDocuments,
        correspondence: mockCorrespondenceDocuments,
        documents: mockDocuments,
      },
    });

    expect(result).toEqual([
      { archived: false, documentId: '1', documentTitle: 'Test Document One' },
      {
        archived: false,
        documentId: '3',
        documentTitle: 'Test Correspondence One',
      },
      { archived: true, documentId: '5', documentTitle: 'Test Archived One' },
      {
        archived: true,
        documentId: '7',
        documentTitle: 'Test Archived Correspondence One',
      },
    ]);
  });

  it('sets the documentTitle from documentType if documentTitle is not set on the document meta', () => {
    const result = formatAttachments({
      attachments: [
        { documentId: '2' },
        { documentId: '4' },
        { documentId: '6' },
        { documentId: '8' },
      ],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocuments: mockArchivedDocuments,
        correspondence: mockCorrespondenceDocuments,
        documents: mockDocuments,
      },
    });

    expect(result).toEqual([
      { archived: false, documentId: '2', documentTitle: 'Test Document Two' },
      {
        archived: false,
        documentId: '4',
        documentTitle: 'Test Correspondence Two',
      },
      { archived: true, documentId: '6', documentTitle: 'Test Archived Two' },
      {
        archived: true,
        documentId: '8',
        documentTitle: 'Test Archived Correspondence Two',
      },
    ]);
  });

  it('defaults the archivedDocuments, archivedCorrespondences, and correspondence arrays to empty arrays if they are not on caseDetail', () => {
    const result = formatAttachments({
      attachments: [{ documentId: '1' }],
      caseDetail: {
        documents: mockDocuments,
      },
    });

    expect(result).toEqual([
      { archived: false, documentId: '1', documentTitle: 'Test Document One' },
    ]);
  });

  it('returns a placeholder document if an attachment is not found in the aggregated documents', () => {
    const result = formatAttachments({
      attachments: [{ documentId: '999' }],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocuments: mockArchivedDocuments,
        correspondence: mockCorrespondenceDocuments,
        documents: mockDocuments,
      },
    });

    expect(result).toEqual([
      {
        archived: true,
        documentId: null,
        documentTitle: '[ Document Unavailable ]',
      },
    ]);
  });

  it('returns an empty array if there are no attachments', () => {
    const result = formatAttachments({
      attachments: [],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocuments: mockArchivedDocuments,
        correspondence: mockCorrespondenceDocuments,
        documents: mockDocuments,
      },
    });

    expect(result).toEqual([]);
  });
});
