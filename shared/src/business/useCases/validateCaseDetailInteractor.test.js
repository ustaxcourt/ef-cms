const {
  validateCaseDetailInteractor,
} = require('./validateCaseDetailInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { User } = require('../entities/User');

const { VALIDATION_ERROR_MESSAGES } = Case;

describe('validate case detail', () => {
  let applicationContext;

  beforeAll(() => {
    applicationContext = {
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
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
        caseTitle: 'A case title',
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
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        hasIrsNotice: true,
        irsNoticeDate: 'aa',
        payGovDate: '12',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
    expect(errors.payGovDate).toBeTruthy();
  });

  it('returns no errors on valid amounts and years', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns no errors on null irsNoticeDate', () => {
    const errors = validateCaseDetailInteractor({
      applicationContext,
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: User.ROLES.petitioner,
            userId: 'petitioner',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: false,
        irsNoticeDate: null,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        payGovDate: '2018-12-24T00:00:00.000Z',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });
});
