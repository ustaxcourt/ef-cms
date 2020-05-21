const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCorrespondenceDocumentInteractor,
} = require('./updateCorrespondenceDocumentInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { Correspondence } = require('../../entities/Correspondence');
const { createISODateString } = require('../../utilities/DateHandler');
const { User } = require('../../entities/User');

describe('updateCorrespondenceDocumentInteractor', () => {
  let mockUser;
  const mockDocumentId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockUserFixture = {
    name: 'Docket Clerk',
    role: User.ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };
  const mockCorrespondence = new Correspondence({
    documentId: 'abc-123',
    documentTitle: 'old document title',
    filedBy: 'docket clerk',
    userId: '123-abc',
  });
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
    correspondence: [mockCorrespondence],
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
    mockUser = mockUserFixture;

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    mockUser = { ...mockUser, role: User.ROLES.petitioner };

    await expect(
      updateCorrespondenceDocumentInteractor({
        applicationContext,
        documentMetadata: { caseId: '123' },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should update the specified correspondence document title when the case entity is valid', async () => {
    await updateCorrespondenceDocumentInteractor({
      applicationContext,
      documentMetadata: {
        caseId: '123',
        documentId: mockCorrespondence.documentId,
        documentTitle: 'A title that has been updated',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().fileCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '123',
      correspondence: {
        ...mockCorrespondence,
        documentTitle: 'A title that has been updated',
      },
    });
  });

  it('should return an updated raw case object', async () => {
    const result = await updateCorrespondenceDocumentInteractor({
      applicationContext,
      documentMetadata: {
        caseId: '123',
        documentId: mockCorrespondence.documentId,
        documentTitle: 'A title that has been updated',
      },
    });

    expect(result).toMatchObject({
      ...mockCase,
      correspondence: [
        {
          ...mockCorrespondence,
          documentTitle: 'A title that has been updated',
        },
      ],
    });
  });
});
