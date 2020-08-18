const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { migrateCaseInteractor } = require('./migrateCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase.js');
const { omit } = require('lodash');
const { User } = require('../entities/User');

const DATE = '2018-11-21T20:49:28.192Z';

let adminUser;
let createdCases;
let caseMetadata;

describe('migrateCaseInteractor', () => {
  beforeEach(() => {
    window.Date.prototype.toISOString = jest.fn(() => DATE);

    adminUser = new User({
      name: 'Joe Exotic',
      role: ROLES.admin,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    createdCases = [];

    applicationContext.environment.stage = 'local';

    applicationContext.getCurrentUser.mockImplementation(() => adminUser);

    applicationContext
      .getPersistenceGateway()
      .createCase.mockImplementation(({ caseToCreate }) => {
        createdCases.push(caseToCreate);
      });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...adminUser,
      section: 'admin',
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(undefined);

    applicationContext.getUseCases().getUserInteractor.mockReturnValue({
      name: 'john doe',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    caseMetadata = {
      caseCaption: 'Custom Caption',
      caseType: CASE_TYPES_MAP.other,
      contactPrimary: {
        address1: '99 South Oak Lane',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'Some City',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner1@example.com',
        name: 'Diana Prince',
        phone: '+1 (215) 128-6587',
        postalCode: '69580',
        state: 'AR',
      },
      docketNumber: '00101-00',
      docketRecord: MOCK_CASE.docketRecord,
      documents: MOCK_CASE.documents,
      filingType: 'Myself',
      hasIrsNotice: true,
      partyType: PARTY_TYPES.petitioner,
      petitionFile: new File([], 'test.pdf'),
      petitionFileSize: 1,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Small',
      signature: true,
      stinFile: new File([], 'test.pdf'),
      stinFileSize: 1,
    };
  });

  it('should get the current user from applicationContext', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata,
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          caseType: CASE_TYPES_MAP.other,
          docketNumber: '00101-00',
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitioner,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error case has a trial session id but it cannot be found in persistence', async () => {
    await expect(
      migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          trialSessionId: 'cafebabe-b37b-479d-9201-067ec6e335bb',
        },
      }),
    ).rejects.toThrow('Trial Session not found');
  });

  it('should pull the current user record from persistence', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalled();
  });

  it('should create a case successfully', async () => {
    expect(createdCases.length).toEqual(0);

    const result = await migrateCaseInteractor({
      applicationContext,
      caseMetadata,
    });

    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().createCase,
    ).toHaveBeenCalled();
    expect(createdCases.length).toEqual(1);
  });

  describe('validation', () => {
    it('should fail to migrate a case when the case is invalid', async () => {
      await expect(
        migrateCaseInteractor({
          applicationContext,
          caseMetadata: {},
        }),
      ).rejects.toThrow('The Case entity was invalid');
    });

    it('should fail to migrate a case when the docket record is invalid', async () => {
      await expect(
        migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...caseMetadata,
            docketRecord: [{}],
          },
        }),
      ).rejects.toThrow('The Case entity was invalid');
    });

    it('should provide developer-friendly feedback when the case is invalid', async () => {
      let error, results;
      try {
        results = await migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...MOCK_CASE,
            docketNumber: 'ABC',
            documents: [{ ...MOCK_CASE.documents[0], documentId: 'invalid' }],
          },
        });
      } catch (e) {
        error = e;
      }

      expect(results).toBeUndefined();
      expect(error.message).toContain(
        "'docketNumber' with value 'ABC' fails to match the required pattern",
      );
      expect(error.message).toContain(
        "'documents[0].documentId' must be a valid GUID",
      );
    });
  });

  describe('Practitioners via barNumber', () => {
    const practitionerData = {
      barNumber: 'PT1234',
      contact: {
        address1: '982 Oak Boulevard',
        address2: 'Maxime dolorum quae ',
        address3: 'Ut numquam ducimus ',
        city: 'Placeat sed dolorum',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (785) 771-2329',
        postalCode: '17860',
        state: 'LA',
      },
      name: 'Keelie Bruce',
      role: 'privatePractitioner',
      userId: '26e21f82-d029-4603-a954-544d8123ea04',
    };

    it('finds an associated privatePractitioner with a barNumber to migrate and overrides the contact information provided with the contact information from persistence', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce(practitionerData);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          privatePractitioners: [
            {
              barNumber: 'PT1234',
              contact: { address1: '123 Main St' },
              name: 'Saul Goodman',
              representingPrimary: true,
              role: 'privatePractitioner',
            },
          ],
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getPractitionerByBarNumber,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0]
          .caseToCreate.privatePractitioners[0],
      ).toMatchObject({ ...practitionerData, representingPrimary: true });
    });

    it('throws a validation error if the privatePractitioner is not found in the database and valid data is not sent', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce(null);

      await expect(
        migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...caseMetadata,
            privatePractitioners: [
              {
                barNumber: 'PT1234',
                role: 'privatePractitioner',
              },
            ],
          },
        }),
      ).rejects.toThrow('The Case entity was invalid');
    });

    it('adds a user id for the privatePractitioner if the practitioner is not found in the database and valid data is sent', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce(null);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          privatePractitioners: [{ ...omit(practitionerData, 'userId') }],
        },
      });

      expect(applicationContext.getUniqueId).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0]
          .caseToCreate.privatePractitioners[0],
      ).toMatchObject({
        ...omit(practitionerData, 'userId'),
      });
    });

    it('finds an associated irsPractitioner with a barNumber to migrate and overrides the contact information provided with the contact information from persistence', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce({
          ...practitionerData,
          role: 'irsPractitioner',
        });

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          irsPractitioners: [
            {
              barNumber: 'PT1234',
              contact: { address1: '123 Main St' },
              name: 'Saul Goodman',
              role: 'irsPractitioner',
            },
          ],
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getPractitionerByBarNumber,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0]
          .caseToCreate.irsPractitioners[0],
      ).toMatchObject({ ...practitionerData, role: 'irsPractitioner' });
    });

    it('throws a validation error if the irsPractitioner is not found in the database and valid data is not sent', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce(null);

      await expect(
        migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...caseMetadata,
            irsPractitioners: [
              {
                barNumber: 'PT1234',
                role: 'irsPractitioner',
              },
            ],
          },
        }),
      ).rejects.toThrow('The Case entity was invalid');
    });

    it('adds a user id for the irsPractitioner if the practitioner is not found in the database and valid data is sent', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionerByBarNumber.mockResolvedValueOnce(null);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          irsPractitioners: [
            { ...omit(practitionerData, 'userId'), role: 'irsPractitioner' },
          ],
        },
      });

      expect(applicationContext.getUniqueId).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0]
          .caseToCreate.irsPractitioners[0],
      ).toMatchObject({
        ...omit(practitionerData, 'userId'),
        role: 'irsPractitioner',
      });
    });
  });

  describe('migrate existing case', () => {
    it('should call persistence to delete old case records and documents if a case was retrieved for caseMetadata.docketNumber and then continue to recreate the case', async () => {
      expect(createdCases.length).toEqual(0);

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

      const result = await migrateCaseInteractor({
        applicationContext,
        caseMetadata,
      });

      expect(
        applicationContext.getPersistenceGateway().deleteCaseByDocketNumber,
      ).toBeCalled();
      expect(
        applicationContext.getPersistenceGateway().deleteDocumentFromS3,
      ).toBeCalledTimes(4); // MOCK_CASE has 4 documents
      expect(result).toBeDefined();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(createdCases.length).toEqual(1);
    });
  });
});
