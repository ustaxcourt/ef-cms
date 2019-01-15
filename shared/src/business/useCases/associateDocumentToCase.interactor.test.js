const {
  associateDocumentToCase,
} = require('./associateDocumentToCase.interactor');

describe('associateDocumentToCase', () => {
  let applicationContext;

  let caseRecord = {
    userId: 'taxpayer',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    createdAt: '',
  };

  it('successfully associates a document to a case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: async () => caseRecord,
          saveCase: async () => null,
        };
      },
      environment: { stage: 'local' },
    };
    const result = await associateDocumentToCase({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userId: 'respondent',
      applicationContext,
    });
    expect(result).toMatchObject({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '45678-18',
      documents: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
          workItems: [],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
          workItems: [],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
          workItems: [],
        },
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          filedBy: 'Test Respondent',
          userId: 'respondent',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseStatus: undefined,
              docketNumber: '45678-18',
              document: {
                documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                documentType: 'Answer',
              },
              messages: [
                {
                  message: 'a Answer filed by respondent is ready for review',
                  sentBy: 'Test Respondent',
                  userId: 'respondent',
                },
              ],
              section: 'docket',
              sentBy: 'respondent',
            },
          ],
        },
      ],
      status: 'new',
      userId: 'taxpayer',
    });
  });
});
