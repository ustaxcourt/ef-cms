const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentContentsForDocuments,
} = require('./getDocumentContentsForDocuments');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('getDocumentContentsForDocuments', () => {
  const petitionerId = '273f5d19-3707-41c0-bccc-449c52dfe54e';

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );
  });

  it('successfully retrieves documentContents', async () => {
    const mockCaseWithDocumentContents = {
      ...MOCK_CASE,
      documents: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketNumber: '101-18',
          documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Petition',
          documentType: 'Petition',
          draftState: {},
          eventCode: 'P',
          processingStatus: 'pending',
          userId: petitionerId,
          workItems: [],
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCaseWithDocumentContents);

    const documentsWithContents = await getDocumentContentsForDocuments({
      applicationContext,
      documents: mockCaseWithDocumentContents.documents,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      documentId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      protocol: 'S3',
      useTempBucket: false,
    });
    expect(documentsWithContents[0]).toMatchObject({
      documentContents: 'the contents!',
      draftState: {
        documentContents: 'the contents!',
        richText: '<b>the contents!</b>',
      },
    });
  });
});
