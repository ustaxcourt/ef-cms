const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
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
let petitionerUser;
let petitioner2User;
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
    petitionerUser = new User({
      email: 'petitioner1@example.com',
      name: 'Diana Prince',
      role: ROLES.petitioner,
      userId: '94f6336d-3632-4d43-8729-1e3b1cf648bf',
    });
    petitioner2User = new User({
      email: 'petitioner2@example.com',
      name: 'Diana Prince',
      role: ROLES.petitioner,
      userId: 'f05947aa-5983-43a9-a795-a8c7de471d94',
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
        phone: '128-6587',
        postalCode: '69580',
        state: 'WI',
      },
      docketEntries: MOCK_CASE.docketEntries,
      docketNumber: '00101-00',
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

    it('should provide developer-friendly feedback when the case is invalid', async () => {
      let error, results;
      try {
        results = await migrateCaseInteractor({
          applicationContext,
          caseMetadata: {
            ...MOCK_CASE,
            docketEntries: [
              { ...MOCK_CASE.docketEntries[0], docketEntryId: 'invalid' },
            ],
            docketNumber: 'ABC',
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
        "'docketEntries[0].docketEntryId' must be a valid GUID",
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
      email: 'practitioner1@example.com',
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
              email: 'practitioner2@example.com',
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
      ).toBeCalledTimes(0); // MOCK_CASE has 4 documents
      expect(result).toBeDefined();
      expect(
        applicationContext.getPersistenceGateway().createCase,
      ).toHaveBeenCalled();
      expect(createdCases.length).toEqual(1);
    });
  });

  it("adds the case to a trial session's calendar if the case has a trialSessionId", async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        isCalendared: true,
        maxCases: 100,
        sessionType: 'Hybrid',
        startDate: '2020-08-10',
        term: 'Summer',
        termYear: '2020',
        trialLocation: 'Memphis, Tennessee',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195fb',
      });

    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195fb',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should throw an exception when contacts are invalid', async () => {
    await expect(
      migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          contactPrimary: {
            address1: '64731 Moss Ridge Suite 997',
            address2: null,
            address3: null,
            city: 'Landrychester',
            contactId: '4C9A4C0E-7267-4A61-A089-2D063E5AB875',
            country: 'U.S.A.',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Griffith, Moore and Freeman (f.k.a Herring-Benitez)',
            postalCode: '73301',
            state: 'TX',
          },
          contactSecondary: undefined,
          partyType:
            'Partnership (as a partner other than Tax Matters Partner)',
        },
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should update all correspondence items on the case', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        correspondence: [
          {
            correspondenceId: 'c19A4C0E-7267-4A61-A089-2D063E5AB875',
            documentTitle: 'Correspondence One',
            userId: '4C9A4C0E-7267-4A61-A089-2D063E5AB875',
          },
          {
            correspondenceId: 'c29A4C0E-7267-4A61-A089-2D063E5AB875',
            documentTitle: 'Correspondence Two',
            userId: '4C9A4C0E-7267-4A61-A089-2D063E5AB875',
          },
          {
            correspondenceId: 'c39A4C0E-7267-4A61-A089-2D063E5AB875',
            documentTitle: 'Correspondence Three',
            userId: '4C9A4C0E-7267-4A61-A089-2D063E5AB875',
          },
        ],
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseCorrespondence,
    ).toHaveBeenCalledTimes(3);
  });

  it('should call updateCase if the case has a leadDocketNumber', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        leadDocketNumber: '123-45',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should not call updateCase if the case has no leadDocketNumber', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('should create a case trial sort mapping record if the case is ready for trial and not blocked', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        blocked: false,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0],
    ).toMatchObject({
      caseSortTags: expect.anything(),
      docketNumber: '101-00',
    });
  });

  it('should not create a case trial sort mapping record if the case is ready for trial and blocked', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        blocked: true,
        blockedDate: '2019-08-25T05:00:00.000Z',
        blockedReason: 'because',
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });

  it('should not create a case trial sort mapping record if the case is ready for trial and automaticBlocked', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        automaticBlocked: true,
        automaticBlockedDate: '2019-08-25T05:00:00.000Z',
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });

  it('should not create a case trial sort mapping record if the case is not ready for trial', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        status: CASE_STATUS_TYPES.generalDocket,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });

  it('should not create a case trial sort mapping record if the case is missing a preferredTrialCity', async () => {
    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: {
        ...caseMetadata,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toBeCalled();

    const loggerCalls = applicationContext.logger.info.mock.calls;

    expect(loggerCalls.length).toBeGreaterThan(0);
    expect(loggerCalls[0][0]).toContain(
      'ready for trial but missing trial city',
    );
  });

  describe('contactPrimary account creation', () => {
    it('should call createUserAccount but not create a user if contactPrimary has e-access and the case status is not closed', async () => {
      applicationContext
        .getPersistenceGateway()
        .getUserByEmail.mockReturnValue(petitionerUser);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          contactPrimary: {
            ...caseMetadata.contactPrimary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail.mock
          .calls[0][0],
      ).toMatchObject({
        email: petitionerUser.email,
      });
      expect(
        applicationContext.getPersistenceGateway().createMigratedPetitionerUser,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase.mock
          .calls[0][0],
      ).toMatchObject({
        docketNumber: '101-00',
        userCase: {
          docketNumber: '101-00',
        },
        userId: petitionerUser.userId,
      });
    });

    it('should call createUserAccount and create a user if contactPrimary has e-access and the case status is not closed', async () => {
      applicationContext
        .getPersistenceGateway()
        .getUserByEmail.mockReturnValue(undefined);
      applicationContext
        .getPersistenceGateway()
        .createMigratedPetitionerUser.mockReturnValue(petitionerUser);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          contactPrimary: {
            ...caseMetadata.contactPrimary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail.mock
          .calls[0][0],
      ).toMatchObject({
        email: petitionerUser.email,
      });
      expect(
        applicationContext.getPersistenceGateway().createMigratedPetitionerUser
          .mock.calls[0][0],
      ).toMatchObject({
        user: {
          email: caseMetadata.contactPrimary.email,
          name: caseMetadata.contactPrimary.name,
          role: ROLES.petitioner,
          userId: expect.anything(),
        },
      });
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase.mock
          .calls[0][0],
      ).toMatchObject({
        docketNumber: '101-00',
        userCase: {
          docketNumber: '101-00',
        },
        userId: petitionerUser.userId,
      });
    });

    it('should not call createUserAccount if contactPrimary does not have e-access', async () => {
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          contactPrimary: {
            ...caseMetadata.contactPrimary,
            hasEAccess: false,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase,
      ).not.toHaveBeenCalled();
    });

    it('should not call createUserAccount and should override hasEAccess to false if contactPrimary has e-access and the case status is closed', async () => {
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadata,
          closedDate: '2019-08-25T05:00:00.000Z',
          contactPrimary: {
            ...caseMetadata.contactPrimary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.closed,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0]
          .caseToCreate.contactPrimary.hasEAccess,
      ).toEqual(false);
    });
  });

  describe('contactSecondary account creation', () => {
    let caseMetadataWithSecondary;

    beforeEach(() => {
      caseMetadataWithSecondary = {
        ...caseMetadata,
        contactSecondary: {
          ...caseMetadata.contactPrimary,
          email: 'petitioner2@example.com',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
      };
    });

    it('should call createUserAccount but not create a user if contactSecondary has e-access and the case status is not closed', async () => {
      applicationContext
        .getPersistenceGateway()
        .getUserByEmail.mockReturnValue(petitioner2User);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadataWithSecondary,
          contactSecondary: {
            ...caseMetadataWithSecondary.contactSecondary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail.mock
          .calls[0][0],
      ).toMatchObject({
        email: petitioner2User.email,
      });
      expect(
        applicationContext.getPersistenceGateway().createMigratedPetitionerUser,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase.mock
          .calls[0][0],
      ).toMatchObject({
        docketNumber: '101-00',
        userCase: {
          docketNumber: '101-00',
        },
        userId: petitioner2User.userId,
      });
    });

    it('should call createUserAccount and create a user if contactSecondary has e-access and the case status is not closed', async () => {
      applicationContext
        .getPersistenceGateway()
        .getUserByEmail.mockReturnValue(undefined);
      applicationContext
        .getPersistenceGateway()
        .createMigratedPetitionerUser.mockReturnValue(petitioner2User);

      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadataWithSecondary,
          contactSecondary: {
            ...caseMetadataWithSecondary.contactSecondary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail.mock
          .calls[0][0],
      ).toMatchObject({
        email: petitioner2User.email,
      });
      expect(
        applicationContext.getPersistenceGateway().createMigratedPetitionerUser
          .mock.calls[0][0],
      ).toMatchObject({
        user: {
          email: caseMetadataWithSecondary.contactSecondary.email,
          name: caseMetadataWithSecondary.contactSecondary.name,
          role: ROLES.petitioner,
          userId: expect.anything(),
        },
      });
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase.mock
          .calls[0][0],
      ).toMatchObject({
        docketNumber: '101-00',
        userCase: {
          docketNumber: '101-00',
        },
        userId: petitioner2User.userId,
      });
    });

    it('should not call createUserAccount if contactSecondary does not have e-access', async () => {
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadataWithSecondary,
          contactSecondary: {
            ...caseMetadataWithSecondary.contactSecondary,
            hasEAccess: false,
          },
          status: CASE_STATUS_TYPES.new,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase,
      ).not.toHaveBeenCalled();
    });

    it('should not call createUserAccount if contactSecondary has e-access and the case status is closed', async () => {
      await migrateCaseInteractor({
        applicationContext,
        caseMetadata: {
          ...caseMetadataWithSecondary,
          closedDate: '2019-08-25T05:00:00.000Z',
          contactSecondary: {
            ...caseMetadataWithSecondary.contactSecondary,
            hasEAccess: true,
          },
          status: CASE_STATUS_TYPES.closed,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().getUserByEmail,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().associateUserWithCase,
      ).not.toHaveBeenCalled();
    });
  });

  it('should send message to SQS queue for each docket entry that has a file attached', async () => {
    const caseWithMinuteEntry = {
      ...caseMetadata,
      docketEntries: [
        ...caseMetadata.docketEntries,
        {
          createdAt: '2020-06-21T20:49:28.192Z',
          docketEntryId: '19193715-21a0-43eb-a2d6-4bfc16c0463d',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial at Birmingham, Alabama',
          documentType: 'Request for Place of Trial',
          eventCode: 'RQT',
          filedBy: 'Test Petitioner',
          filingDate: '2020-03-01T00:01:00.000Z',
          index: 5,
          isFileAttached: false,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    };

    await migrateCaseInteractor({
      applicationContext,
      caseMetadata: caseWithMinuteEntry,
    });

    expect(caseWithMinuteEntry.docketEntries.length).toEqual(5);
    expect(applicationContext.getQueueService().sendMessage).toBeCalledTimes(4);
  });
});
