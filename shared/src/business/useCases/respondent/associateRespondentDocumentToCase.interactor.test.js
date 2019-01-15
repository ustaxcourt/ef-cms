const {
  associateRespondentDocumentToCase,
} = require('./associateRespondentDocumentToCase.interactor');

describe('associateRespondentDocumentToCase', () => {
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

  it('throws an error when the user is not validated to get the cases by status', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: async () => caseRecord,
          saveCase: async () => null,
        };
      },
      environment: { stage: 'local' },
    };
    const result = await associateRespondentDocumentToCase({
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
      respondent: {
        addressLine1: '111 Orange St.',
        addressLine2: 'Building 2',
        barNumber: '12345',
        city: 'Orlando',
        email: 'testrespondent@example.com',
        name: 'Test Respondent',
        phone: '111-111-1111',
        respondentId: 'respondent',
        role: 'respondent',
        state: 'FL',
        token: 'respondent',
        userId: 'respondent',
        zip: '37208',
      },
      status: 'new',
      userId: 'taxpayer',
    });
  });
});
