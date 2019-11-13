import { fileCourtIssuedDocketEntryInteractor } from './fileCourtIssuedDocketEntryInteractor';
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { User } = require('../../entities/User');

describe('fileCourtIssuedDocketEntryInteractor', () => {
  let updateCaseMock;
  let applicationContext;
  let caseRecord;

  beforeEach(() => {
    updateCaseMock = jest.fn(() => caseRecord);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        getCaseByCaseId: async () => caseRecord,
        getUserById: async () => ({
          name: 'Olivia Jade',
          role: User.ROLES.adc,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        saveWorkItemForNonPaper: async () => caseRecord,
        updateCase: updateCaseMock,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    caseRecord = {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      contactPrimary: {
        name: 'Guy Fieri',
      },
      createdAt: '',
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
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
  });

  it('should throw an error if not authorized', async () => {
    let error;
    try {
      await fileCourtIssuedDocketEntryInteractor({
        applicationContext,
        document: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should call updateCase', async () => {
    applicationContext.getCurrentUser = () => ({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      document: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Order',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(updateCaseMock).toHaveBeenCalled();
  });
});
