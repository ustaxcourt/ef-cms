const {
  CASE_STATUS_TYPES,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const {
  saveCaseDetailInternalEditInteractor,
} = require('./saveCaseDetailInternalEditInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { COUNTRY_TYPES, ROLES } = require('../entities/EntityConstants');
const { omit } = require('lodash');

describe('updateCase', () => {
  const MOCK_CASE = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Other',
    contactPrimary: {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'fieri@example.com',
      name: 'Guy Fieri',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    },
    createdAt: new Date().toISOString(),
    docketNumber: '56789-18',
    documents: [
      {
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Petition',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
        workItems: [
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '56789-18',
            document: { documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859' },
            isInitializeCase: true,
            isQC: true,
            section: 'petitions',
            sentBy: 'petitioner',
            workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
          },
        ],
      },
      {
        documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
      {
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Motion',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
    ],
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [{ name: 'Test Petitioner' }],
    preferredTrialCity: 'Washington, District of Columbia',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'userId',
  };

  const petitionsClerkUser = {
    name: 'petitions clerk',
    role: ROLES.petitionsClerk,
    userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
  };

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error if the caseToUpdate passed in is an invalid case', async () => {
    await expect(
      saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseToUpdate: omit(MOCK_CASE, 'docketNumber'),
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should throw an error if caseToUpdate is not passed in', async () => {
    await expect(
      saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
      }),
    ).rejects.toThrow('cannot process');
  });

  it('should update the validated documents on a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);

    const updatedCase = await saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '193 South Hague Freeway',
          address2: 'Sunt maiores vitae ',
          address3: 'Culpa ex aliquip ven',
          city: 'Aperiam minim sunt r',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Iola Snow',
          phone: '+1 (772) 246-3448',
          postalCode: '26037',
          state: 'IA',
        },
        contactSecondary: {
          address1: '86 West Rocky Cowley Extension',
          address2: 'Aperiam aliquip volu',
          address3: 'Eos consequuntur max',
          city: 'Deleniti lorem sit ',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Linda Singleton',
          phone: '+1 (153) 683-1448',
          postalCode: '89985',
          state: 'FL',
        },
        createdAt: '2019-07-24T16:30:01.940Z',
        docketNumber: '168-19',
        docketNumberSuffix: 'S',
        filingType: 'Myself and my spouse',
        hasVerifiedIrsNotice: false,
        isPaper: false,
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Mobile, Alabama',
        privatePractitioners: [],
        procedureType: 'Small',
      },
    });

    const returnedDocument = omit(updatedCase.documents[0], 'createdAt');
    const documentToMatch = omit(MOCK_CASE.documents[0], 'createdAt');
    expect(returnedDocument).toMatchObject(documentToMatch);
  });

  it("should move the initialize case work item into the current user's in-progress box if the case is not paper", async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);

    await saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForPaper,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForPaper.mock
        .calls[0][0].workItem,
    ).toMatchObject({
      assigneeId: petitionsClerkUser.userId,
      assigneeName: petitionsClerkUser.name,
      caseIsInProgress: true,
    });
  });

  it('should not update work items if the case is paper', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.isPaper = true;
    caseToUpdate.mailingDate = 'yesterday';

    await saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForPaper,
    ).not.toBeCalled();
  });

  it('should fail if the primary or secondary contact is empty', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);

    await expect(
      saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: caseToUpdate.caseId,
        caseToUpdate: {
          ...caseToUpdate,
          contactPrimary: null,
          contactSecondary: {},
        },
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseToUpdate: MOCK_CASE,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should throw an error if the user is unauthorized to update a case part deux', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      saveCaseDetailInternalEditInteractor({
        applicationContext,
        caseId: '123',
        caseToUpdate: MOCK_CASE,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });
});
