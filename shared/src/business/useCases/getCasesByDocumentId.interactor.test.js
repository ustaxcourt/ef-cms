const { getCasesByDocumentId } = require('./getCasesByDocumentId.interactor');

describe('getCasesByDocumentId', () => {
  let applicationContext;
  it('throws an error when the user is not validated to get the cases by status', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByDocumentId: async () => [
            { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
          ],
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesByDocumentId({
        userId: 'taxpayer',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns the cases returned from persistence', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByDocumentId: async () => [
            {
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              docketNumber: '101-18',
              documents: [
                {
                  documentType: 'Answer',
                  userId: 'respondent',
                  documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                },
              ],
            },
          ],
        };
      },
      environment: { stage: 'local' },
    };
    const result = await getCasesByDocumentId({
      userId: 'docketclerk',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
    });

    expect(result).toMatchObject([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        documents: [
          {
            documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            documentType: 'Answer',
            userId: 'respondent',
            workItems: [],
          },
        ],
        status: 'new',
      },
    ]);
  });
});
