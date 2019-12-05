const {
  getPublicDownloadPolicyUrlInteractor,
} = require('./getPublicDownloadPolicyUrlInteractor');
const { Document } = require('../../entities/Document');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getPublicDownloadPolicyUrlInteractor', () => {
  beforeEach(() => {});

  it('should throw an error for a document that is not public accessible', async () => {
    const applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => ({ ...MOCK_CASE }),
        getPublicDownloadPolicyUrl: () => 'localhost',
      }),
    };
    await expect(
      getPublicDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: '123',
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow();
  });

  it('should return a url for a document that is public accessible', async () => {
    const applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByCaseId: () => ({ ...MOCK_CASE }),
        getPublicDownloadPolicyUrl: () => 'localhost',
      }),
    };
    MOCK_CASE.documents.push(
      new Document(
        {
          documentId: '8008b288-8b6b-48e3-8239-599266b13b8b',
          documentTitle: 'Order to do something',
          documentType: 'O - Order',
          eventCode: 'O',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    const result = await getPublicDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: '123',
      documentId: '8008b288-8b6b-48e3-8239-599266b13b8b',
    });
    expect(result).toEqual('localhost');
  });
});
