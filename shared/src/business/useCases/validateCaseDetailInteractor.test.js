const {
  validateCaseDetailInteractor,
} = require('./validateCaseDetailInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { MOCK_USERS } = require('../../test/mockUsers');
const { User } = require('../entities/User');
const { VALIDATION_ERROR_MESSAGES } = Case;

const contactPrimary = {
  address1: '123 Main St',
  city: 'Somewhere',
  countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
  name: 'Test Petitioner',
  phone: '1234567890',
  postalCode: '12345',
  state: 'TN',
};

describe('validate case detail', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {},
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
    });
  });

  it('does not return an error if that field is valid', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseCaption: 'A case caption',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
    });
  });

  it('returns no errors if the case validates', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseCaption: 'Caption',
        caseType: 'Other',
        contactPrimary,
        docketNumber: '101-18',
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'Myself',
        hasVerifiedIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        hasVerifiedIrsNotice: true,
        irsNoticeDate: 'aa',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
  });

  it('returns no errors on valid amounts and years', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseCaption: 'Caption',
        caseType: 'Other',
        contactPrimary,
        docketNumber: '101-18',
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'Other',
        hasVerifiedIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns no errors on null irsNoticeDate', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseCaption: 'Caption',
        caseType: 'Other',
        contactPrimary,
        docketNumber: '101-18',
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'Other',
        hasVerifiedIrsNotice: false,
        irsNoticeDate: null,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });
});
