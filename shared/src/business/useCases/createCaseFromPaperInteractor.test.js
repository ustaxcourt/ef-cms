jest.mock('uuid');
const uuid = require('uuid');
const {
  createCaseFromPaperInteractor,
} = require('./createCaseFromPaperInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

describe('createCaseFromPaperInteractor', () => {
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const DATE = '2018-11-21T20:49:28.192Z';

  beforeEach(() => {
    uuid.v4 = jest.fn().mockReturnValue(MOCK_CASE_ID);
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(DATE);

    applicationContext.docketNumberGenerator.createDocketNumber.mockResolvedValue(
      '00101-00',
    );
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .createCase.mockResolvedValue(null);

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext
      .getPersistenceGateway()
      .saveWorkItemForPaper.mockResolvedValue(null);

    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    applicationContext.getUseCases().getUserInteractor.mockReturnValue({
      name: 'john doe',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    let error;
    try {
      await createCaseFromPaperInteractor({ applicationContext });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('creates a case from paper', async () => {
    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: 'domestic',
            email: 'petitioner1@example.com',
            name: 'Diana Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a secondary contact', async () => {
    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: 'domestic',
            email: 'petitioner1@example.com',
            name: 'Diana Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: { name: 'Bob Prince' },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'test',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a request for place of trial and preferred trial city', async () => {
    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: 'domestic',
            email: 'petitioner1@example.com',
            name: 'Diana Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with Application for Waiver of Filing Fee', async () => {
    let error;
    let caseFromPaper;

    try {
      caseFromPaper = await createCaseFromPaperInteractor({
        applicationContext,
        applicationForWaiverOfFilingFeeFileId:
          '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: 'Other',
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: 'domestic',
            email: 'petitioner1@example.com',
            name: 'Diana Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: new Date().toISOString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseFromPaper).toBeDefined();
  });
});
