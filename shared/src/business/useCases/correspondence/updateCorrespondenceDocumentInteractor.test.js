const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  updateCorrespondenceDocumentInteractor,
} = require('./updateCorrespondenceDocumentInteractor');
const { Correspondence } = require('../../entities/Correspondence');
const { createISODateString } = require('../../utilities/DateHandler');

describe('updateCorrespondenceDocumentInteractor', () => {
  let mockUser;
  const mockDocumentId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockUserFixture = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };
  const mockCorrespondence = new Correspondence({
    documentId: '74e36bf7-dcbd-4ee7-a9ec-6d7446096df8',
    documentTitle: 'old document title',
    filedBy: 'docket clerk',
    userId: '5980d666-641d-455a-8386-18908d50c98e',
  });
  const mockCase = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    contactPrimary: {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
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
        description: 'Docket Record 1',
        docketRecordId: mockDocumentId,
        documentId: mockDocumentId,
        eventCode: 'OAJ',
        filingDate: createISODateString(),
        index: 0,
      },
    ],
    documents: [
      {
        documentId: mockDocumentId,
        documentType: 'Order that case is assigned',
        eventCode: 'OAJ',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
    ],
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
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
    mockUser = { ...mockUser, role: ROLES.petitioner };

    await expect(
      updateCorrespondenceDocumentInteractor({
        applicationContext,
        documentMetadata: { caseId: '2368f6c6-e91f-4df3-98fd-43e55c00f6f1' },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should update the specified correspondence document title when the case entity is valid', async () => {
    await updateCorrespondenceDocumentInteractor({
      applicationContext,
      documentMetadata: {
        caseId: '2e528c9c-70f5-4b3e-81c6-1a2f715261b4',
        documentId: mockCorrespondence.documentId,
        documentTitle: 'A title that has been updated',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().fileCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '2e528c9c-70f5-4b3e-81c6-1a2f715261b4',
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
        caseId: '2368f6c6-e91f-4df3-98fd-43e55c00f6f1',
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
