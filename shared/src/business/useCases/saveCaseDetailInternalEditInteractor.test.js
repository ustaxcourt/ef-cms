const {
  saveCaseDetailInternalEditInteractor,
} = require('./saveCaseDetailInternalEditInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { omit } = require('lodash');
const { User } = require('../entities/User');

const MOCK_CASE = {
  caseCaption: 'Caption',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  contactPrimary: {
    address1: '123 Main St',
    city: 'Somewhere',
    countryType: 'domestic',
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
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
  ],
  filingType: 'Myself',
  hasIrsNotice: false,
  partyType: ContactFactory.PARTY_TYPES.petitioner,
  petitioners: [{ name: 'Test Petitioner' }],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: Case.STATUS_TYPES.new,
  userId: 'userId',
};

beforeAll(() => {
  applicationContext.getCurrentUser.mockReturnValue({
    role: User.ROLES.petitionsClerk,
    userId: 'petitionsclerk',
  });

  applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId.mockReturnValue(MOCK_CASE);
});

describe('updateCase', () => {
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

  it('should update a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;

    const updatedCase = await saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: caseToUpdate,
    });

    const returnedDocument = omit(updatedCase.documents[0], [
      'createdAt',
      'receivedAt',
    ]);
    const documentToMatch = omit(MOCK_DOCUMENTS[0], 'createdAt');
    expect(returnedDocument).toMatchObject(documentToMatch);
  });

  it('should update the validated documents on a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;

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
          countryType: 'domestic',
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
          countryType: 'domestic',
          name: 'Linda Singleton',
          phone: '+1 (153) 683-1448',
          postalCode: '89985',
          state: 'FL',
        },
        createdAt: '2019-07-24T16:30:01.940Z',
        docketNumber: '168-19',
        docketNumberSuffix: 'S',
        filingType: 'Myself and my spouse',
        hasIrsNotice: false,
        isPaper: false,
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Mobile, Alabama',
        privatePractitioners: [],
        procedureType: 'Small',
      },
    });

    const returnedDocument = omit(updatedCase.documents[0], 'createdAt');
    const documentToMatch = omit(MOCK_DOCUMENTS[0], 'createdAt');
    expect(returnedDocument).toMatchObject(documentToMatch);
  });

  it('should fail if the primary or secondary contact is empty', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;

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
    ).rejects.toThrow();
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
