const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('getAttachmentDocumentById', () => {
  it('should get a docket entry document', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const result = Case.getAttachmentDocumentById({
      caseDetail: myCase.toRawObject(),
      docketEntryId: MOCK_DOCUMENTS[0].docketEntryId,
    });
    expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
  });

  it('should get a correspondence document', () => {
    const mockCorrespondenceId = '640ac314-0579-4081-8176-88cbe75e16a5';
    const myCase = new Case(
      {
        ...MOCK_CASE,
        correspondence: [
          {
            archived: false,
            correspondenceId: mockCorrespondenceId,
            documentTitle: 'test',
            filingDate: '2019-03-01T21:40:46.415Z',
            userId: 'ec91e317-bfb2-4696-8ae3-064b5c556a56',
          },
        ],
      },
      {
        applicationContext,
      },
    );
    const result = Case.getAttachmentDocumentById({
      caseDetail: myCase.toRawObject(),
      documentId: mockCorrespondenceId,
    });
    expect(result.correspondenceId).toEqual(mockCorrespondenceId);
  });

  it('should get an archived docket entry document if useArchived is true', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: [],
      },
      {
        applicationContext,
      },
    );
    const result = Case.getAttachmentDocumentById({
      caseDetail: myCase.toRawObject(),
      documentId: MOCK_DOCUMENTS[0].docketEntryId,
      useArchived: true,
    });
    expect(result.docketEntryId).toEqual(MOCK_DOCUMENTS[0].docketEntryId);
  });

  it('should return undefined when attempting to get an archived docket entry and useArchived is not pased in', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: [],
      },
      {
        applicationContext,
      },
    );
    const result = Case.getAttachmentDocumentById({
      caseDetail: myCase.toRawObject(),
      documentId: MOCK_DOCUMENTS[0].docketEntryId,
    });
    expect(result).toBeUndefined();
  });

  it('should get an archived correspondence document', () => {
    const mockCorrespondenceId = '640ac314-0579-4081-8176-88cbe75e16a5';
    const myCase = new Case(
      {
        ...MOCK_CASE,
        archivedCorrespondences: [
          {
            archived: true,
            correspondenceId: mockCorrespondenceId,
            documentTitle: 'test',
            filingDate: '2019-03-01T21:40:46.415Z',
            userId: 'ec91e317-bfb2-4696-8ae3-064b5c556a56',
          },
        ],
      },
      {
        applicationContext,
      },
    );
    const result = Case.getAttachmentDocumentById({
      caseDetail: myCase.toRawObject(),
      documentId: mockCorrespondenceId,
      useArchived: true,
    });
    expect(result.correspondenceId).toEqual(mockCorrespondenceId);
  });
});
