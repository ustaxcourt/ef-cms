const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fileCorrespondenceDocumentInteractor,
} = require('./fileCorrespondenceDocumentInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { createISODateString } = require('../../utilities/DateHandler');
const { User } = require('../../entities/User');

describe('fileCorrespondenceDocumentInteractor', () => {
  const mockDocumentId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  const mockUser = {
    name: 'Docket Clerk',
    role: User.ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };
  const mockCase = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    contactPrimary: {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
      email: 'contact@example.com',
      name: 'Contact Primary',
      phone: '123123134',
      postalCode: '12345',
      state: 'TN',
    },
    docketNumber: '123-45',
    docketRecord: [
      {
        description: 'Docket Record 0',
        docketRecordId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        eventCode: 'O',
        filingDate: createISODateString(),
        index: 0,
      },
      {
        description: 'Docket Record 1',
        docketRecordId: mockDocumentId,
        documentId: mockDocumentId,
        eventCode: 'OAJ',
        filingDate: createISODateString(),
        index: 1,
      },
    ],
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        documentType: 'O - Order',
        eventCode: 'O',
        serviceStamp: 'Served',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
      {
        documentId: mockDocumentId,
        documentType: 'OAJ - Order that case is assigned',
        eventCode: 'OAJ',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
    ],
    filingType: 'Myself',
    partyType: ContactFactory.PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseToUpdate => caseToUpdate);
  });

  it('should throw an Unauthorized error if the user role does not have theCASE_CORRESPONDENCE permission', async () => {
    const user = { ...mockUser, role: User.ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      fileCorrespondenceDocumentInteractor({
        applicationContext,
        documentMetadata: { caseId: '123' },
        primaryDocumentFileId: '111',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(null);

    await expect(
      fileCorrespondenceDocumentInteractor({
        applicationContext,
        documentMetadata: { caseId: '123' },
        primaryDocumentFileId: '111',
      }),
    ).rejects.toThrow('Case 123 was not found');
  });

  it('should add the correspondence document to the case when the case entity is valid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);

    await fileCorrespondenceDocumentInteractor({
      applicationContext,
      documentMetadata: {
        caseId: '123',
        documentTitle: 'A title',
        filingDate: '2001-02-01',
      },
      primaryDocumentFileId: '111',
    });
    expect(
      applicationContext.getPersistenceGateway().fileCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '123',
      correspondence: {
        documentId: '111',
        documentTitle: 'A title',
        filedBy: mockUser.name,
        filingDate: '2001-02-01',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
    });
  });

  it('should return an updated raw case object', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);

    const result = await fileCorrespondenceDocumentInteractor({
      applicationContext,
      documentMetadata: {
        caseId: '123',
        documentTitle: 'A title',
        filingDate: '2001-02-01',
      },
      primaryDocumentFileId: '111',
    });
    expect(result).toMatchObject({
      ...mockCase,
      correspondence: [
        {
          documentId: '111',
          documentTitle: 'A title',
          filedBy: mockUser.name,
          filingDate: '2001-02-01',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        },
      ],
    });
  });
});
