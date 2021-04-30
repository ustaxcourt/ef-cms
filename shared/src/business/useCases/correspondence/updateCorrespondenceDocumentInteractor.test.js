const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
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
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockUserFixture = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };

  const mockCorrespondence = new Correspondence({
    correspondenceId: '74e36bf7-dcbd-4ee7-a9ec-6d7446096df8',
    documentTitle: 'old document title',
    filedBy: 'docket clerk',
    userId: '5980d666-641d-455a-8386-18908d50c98e',
  });

  const mockCase = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    correspondence: [mockCorrespondence],
    docketEntries: [
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: '123-45',
        documentTitle: 'Docket Record 1',
        documentType: 'Order that case is assigned',
        eventCode: 'OAJ',
        filingDate: createISODateString(),
        index: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: '611dc444-fd8f-43a0-8844-c4d57745c718',
        signedJudgeName: 'Judy',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
      },
    ],
    docketNumber: '123-45',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'contact@example.com',
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
    ],
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
  };

  beforeEach(() => {
    mockUser = mockUserFixture;

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    mockUser = { ...mockUser, role: ROLES.petitioner };

    await expect(
      updateCorrespondenceDocumentInteractor(applicationContext, {
        documentMetadata: { docketNumber: mockCase.docketNumber },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should update the specified correspondence document title when the case entity is valid', async () => {
    await updateCorrespondenceDocumentInteractor(applicationContext, {
      documentMetadata: {
        correspondenceId: mockCorrespondence.correspondenceId,
        docketNumber: mockCase.docketNumber,
        documentTitle: 'A title that has been updated',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      correspondence: {
        ...mockCorrespondence,
        documentTitle: 'A title that has been updated',
      },
      docketNumber: mockCase.docketNumber,
    });
  });

  it('should return an updated raw case object', async () => {
    const result = await updateCorrespondenceDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          correspondenceId: mockCorrespondence.correspondenceId,
          docketNumber: mockCase.docketNumber,
          documentTitle: 'A title that has been updated',
        },
      },
    );

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
