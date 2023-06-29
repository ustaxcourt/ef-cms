import { applicationContext } from '../test/createTestApplicationContext';
import { formatAttachments } from './formatAttachments';

describe('formatAttachments', () => {
  const mockDocketEntries = [
    {
      docketEntryId: '1',
      documentTitle: 'Test Document One',
    },
    {
      docketEntryId: '2',
      documentType: 'Test Document Two',
    },
  ];

  const mockCorrespondenceDocuments = [
    {
      correspondenceId: '3',
      documentTitle: 'Test Correspondence One',
    },
    {
      correspondenceId: '4',
      documentType: 'Test Correspondence Two',
    },
  ];

  const mockArchivedDocketEntries = [
    {
      archived: true,
      docketEntryId: '5',
      documentTitle: 'Test Archived One',
    },
    {
      archived: true,
      docketEntryId: '6',
      documentType: 'Test Archived Two',
    },
  ];

  const mockArchivedCorrespondenceDocuments = [
    {
      archived: true,
      correspondenceId: '7',
      documentTitle: 'Test Archived Correspondence One',
    },
    {
      archived: true,
      correspondenceId: '8',
      documentType: 'Test Archived Correspondence Two',
    },
  ];

  it('formats docketEntries in the attachments array based on meta from docketEntries in the docketEntries, correspondence, archivedDocketEntries, and archivedCorrespondences arrays', () => {
    const firstGeneratedTitle = 'Test Document One';
    const secondGeneratedTitle = 'Test Archived One';
    const thirdGeneratedTitle = 'Test Archived Correspondence One';
    const fourthGeneratedTitle = 'Test Archived Correspondence Two';

    applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo.mockReturnValueOnce(
        firstGeneratedTitle,
      )
      .mockReturnValueOnce(secondGeneratedTitle)
      .mockReturnValueOnce(thirdGeneratedTitle)
      .mockReturnValueOnce(fourthGeneratedTitle);

    const result = formatAttachments({
      applicationContext,
      attachments: [
        { documentId: '1' },
        { documentId: '3' },
        { documentId: '5' },
        { documentId: '7' },
      ],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocketEntries: mockArchivedDocketEntries,
        correspondence: mockCorrespondenceDocuments,
        docketEntries: mockDocketEntries,
      },
    });

    expect(result).toEqual([
      { archived: false, documentId: '1', documentTitle: firstGeneratedTitle },
      {
        archived: false,
        documentId: '3',
        documentTitle: secondGeneratedTitle,
      },
      { archived: true, documentId: '5', documentTitle: thirdGeneratedTitle },
      {
        archived: true,
        documentId: '7',
        documentTitle: fourthGeneratedTitle,
      },
    ]);
  });

  it('sets the documentTitle from documentType if documentTitle is not set on the document meta', () => {
    const result = formatAttachments({
      applicationContext,
      attachments: [
        { documentId: '2' },
        { documentId: '4' },
        { documentId: '6' },
        { documentId: '8' },
      ],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocketEntries: mockArchivedDocketEntries,
        correspondence: mockCorrespondenceDocuments,
        docketEntries: mockDocketEntries,
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

  it('returns a placeholder document if an attachment is not found in the aggregated docketEntries', () => {
    const result = formatAttachments({
      applicationContext,
      attachments: [{ documentId: '999' }],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocketEntries: mockArchivedDocketEntries,
        correspondence: mockCorrespondenceDocuments,
        docketEntries: mockDocketEntries,
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
      applicationContext,
      attachments: [],
      caseDetail: {
        archivedCorrespondences: mockArchivedCorrespondenceDocuments,
        archivedDocketEntries: mockArchivedDocketEntries,
        correspondence: mockCorrespondenceDocuments,
        docketEntries: mockDocketEntries,
      },
    });

    expect(result).toEqual([]);
  });
});
