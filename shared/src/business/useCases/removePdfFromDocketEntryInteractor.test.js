const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  removePdfFromDocketEntryInteractor,
} = require('./removePdfFromDocketEntryInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('removePdfFromDocketEntryInteractor', () => {
  const MOCK_CASE = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.other,
    createdAt: applicationContext.getUtilities().createISODateString(),
    docketEntries: [
      {
        docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '56789-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
      {
        docketEntryId: '1905d1ab-18d0-43ec-bafb-654e83405491',
        docketNumber: '56789-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        isFileAttached: false,
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
    ],
    docketNumber: '56789-18',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Washington, District of Columbia',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  const docketClerkUser = {
    name: 'docket clerk',
    role: ROLES.docketClerk,
    userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
  };

  beforeAll(() => {
    applicationContext.getPersistenceGateway().deleteDocumentFromS3 = jest.fn();

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseDetail => caseDetail);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      removePdfFromDocketEntryInteractor(applicationContext, {
        docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should fetch the case by the provided docketNumber', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should delete the pdf from s3 and update the case if the docketEntry has a file attached', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416', // entry with isFileAttached: true
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should set the docketEntry isFileAttached flag to false', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: MOCK_CASE.docketNumber,
    });

    const docketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.docketEntryId === '7805d1ab-18d0-43ec-bafb-654e83405416',
      );

    expect(docketEntry.isFileAttached).toEqual(false);
  });

  it('does not modify the docketEntry or case if the isFileAttachedFlag is false', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '1905d1ab-18d0-43ec-bafb-654e83405491', // entry with isFileAttached: false
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('does not modify the docketEntry or case if the docketEntry can not be found on the case', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: 'nope',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });
});
