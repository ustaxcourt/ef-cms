/* eslint-disable max-lines */
import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../entities/EntityConstants';
import { Case, getContactPrimary } from '../../entities/cases/Case';
import {
  FORMATS,
  formatDateString,
  formatNow,
  getBusinessDateInFuture,
} from '../../utilities/DateHandler';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, petitionsClerkUser } from '../../../test/mockUsers';
import { getFakeFile, testPdfDoc } from '../../test/getFakeFile';
import { serveCaseToIrsInteractor } from './serveCaseToIrsInteractor';

describe('serveCaseToIrsInteractor', () => {
  const MOCK_WORK_ITEM = {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseStatus: CASE_STATUS_TYPES.new,
    completedAt: '2018-12-27T18:06:02.968Z',
    completedBy: PARTY_TYPES.petitioner,
    completedByUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketEntry: {
      createdAt: '2018-12-27T18:06:02.968Z',
      docketEntryId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    isInitializeCase: true,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: PARTY_TYPES.petitioner,
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: ROLES.petitioner,
        to: null,
      },
    ],
    section: DOCKET_SECTION,
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  };

  let mockCase;
  let getObjectMock = () => {
    return {
      promise: () => ({
        Body: testPdfDoc,
      }),
    };
  };
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });
  });

  beforeEach(() => {
    mockLock = undefined;
    mockCase = { ...MOCK_CASE };
    mockCase.docketEntries[0].workItem = { ...MOCK_WORK_ITEM };
    applicationContext.getPersistenceGateway().updateWorkItem = jest.fn();

    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, cb) => {
        return cb(null, true);
      },
    });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'www.example.com' });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);

    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(
        (_applicationContext, { caseEntity, docketEntryId }) =>
          caseEntity.docketEntries.find(d => d.docketEntryId === docketEntryId),
      );

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(testPdfDoc);
  });

  it('should throw unauthorized error when user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add a coversheet to the served petition', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: false,
    });
  });

  it('should not add a coversheet if a file is not attached to the docket entry', async () => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          isFileAttached: false,
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should replace coversheet on the served petition if the case is not paper', async () => {
    mockCase = { ...MOCK_CASE };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: true,
    });
  });

  it('should preserve original case caption and docket number on the coversheet if the case is not paper', async () => {
    mockCase = { ...MOCK_CASE };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: true,
      useInitialData: true,
    });
  });

  it('should generate a second notice of receipt of petition when contactSecondary.address is different from contactPrimary.address', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          address1: '123 Side St',
          city: 'Somewhere Else',
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner Secondary',
          phone: '1234547',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'TN',
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUtilities().getAddressPhoneDiff,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.contact,
    ).toMatchObject({
      address1: '123 Side St',
      name: 'Test Petitioner Secondary',
    });
  });

  it('should NOT generate a second notice of receipt of petition when contactSecondary.address is NOT different from contactPrimary.address', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: {
        ...getContactPrimary(MOCK_CASE),
        contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
        name: 'Test Petitioner Secondary',
      },
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getUtilities().getAddressPhoneDiff,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(1);
  });

  it('should generate a second notice of receipt of petition with different access codes when contactSecondary.address is the same as contactPrimary.address, but the contactPrimary does NOT want e service (no paperPetitionEmail) but contactSecondary is setup for e service (has paperPetitionEmail set)', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        { ...MOCK_CASE.petitioners[0], hasConsentedToEService: false },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          hasConsentedToEService: true,
          name: 'Test Petitioner Secondary',
          paperPetitionEmail: 'testing@example.com',
          phone: '1234547',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUtilities().getAddressPhoneDiff,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data.contact,
    ).toMatchObject({
      address1: '123 Main St',
    });
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.contact,
    ).toMatchObject({
      address1: '123 Main St',
    });
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data.accessCode,
    ).not.toEqual(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.accessCode,
    );
  });

  it('should generate a second notice of receipt of petition when contactSecondary.address is the same as contactPrimary.address, and the secondary has no email or e access', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          hasConsentedToEService: true,
          paperPetitionEmail: 'testing@example.com',
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          hasConsentedToEService: false,
          name: 'Test Petitioner Secondary',
          paperPetitionEmail: undefined,
          phone: '1234547',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
  });

  it('should generate a second notice of receipt of petition with different access codes when both have e access to the same paperPetitionEmail AND have the same address', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          hasConsentedToEService: true,
          paperPetitionEmail: 'testing@example.com',
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          email: 'petitioner@example.com',
          hasConsentedToEService: true,
          name: 'Test Petitioner Secondary',
          paperPetitionEmail: 'testing@example.com',
          phone: '1234547',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data.accessCode,
    ).toEqual(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.accessCode,
    );

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
  });

  it('should generate a second notice of receipt of petition with the same access code when both have e access to the same paperPetitionEmail BUT not the same address', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          hasConsentedToEService: true,
          paperPetitionEmail: 'testing@example.com',
        },
        {
          ...MOCK_CASE.petitioners[0],
          address1: 'addy 1',
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          hasConsentedToEService: true,
          name: 'Test Petitioner Secondary',
          paperPetitionEmail: 'testing@example.com',
          phone: '1234547',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data.accessCode,
    ).toEqual(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.accessCode,
    );

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
  });

  it('should generate a second notice of receipt of petition when both have e access but they have different paperPetitionEmail', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          hasConsentedToEService: true,
          paperPetitionEmail: 'testing1@example.com',
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          hasConsentedToEService: true,
          name: 'Test Petitioner Secondary',
          paperPetitionEmail: 'testing@example.com',
          phone: '1234547',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data.accessCode,
    ).not.toEqual(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.accessCode,
    );
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
  });

  it('should generate the receipt like normal even if a trial city is undefined', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: {
        ...getContactPrimary(MOCK_CASE),
        contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
        name: 'Test Petitioner Secondary',
      },
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      preferredTrialCity: null,
      procedureType: 'Regular',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUtilities().combineTwoPdfs,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(1);
  });

  it('should add Filing Fee Waived document to case entity when petitionPaymentStatus === PAYMENT_STATUS.WAIVED', async () => {
    const addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2019-08-25T05:00:00.000Z',
      preferredTrialCity: null,
      procedureType: 'Regular',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(addDocketEntrySpy.mock.calls[0][0].documentTitle).toEqual(
      'Filing Fee Waived',
    );
  });

  it('should add Filing Fee Paid document to case entity when petitionPaymentStatus === PAYMENT_STATUS.PAID', async () => {
    const addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      petitionPaymentDate: '2019-08-25T05:00:00.000Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
      preferredTrialCity: null,
      procedureType: 'Regular',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(addDocketEntrySpy.mock.calls[0][0].documentTitle).toEqual(
      'Filing Fee Paid',
    );
  });

  describe('clinic letters', () => {
    it('should append a clinic letter to the notice of receipt of petition when one exists for the requested place of trial and petition is pro se', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(true);

      mockCase = {
        ...MOCK_CASE,
        isPaper: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Los Angeles, California',
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getPersistenceGateway().isFileExists,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
      ).toMatchObject({
        key: 'clinic-letter-los-angeles-california-regular',
        useTempBucket: false,
      });

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(1);
    });

    it('should NOT append a clinic letter to the notice of receipt of petition if it does NOT exist and petition is pro se', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(false);

      mockCase = {
        ...MOCK_CASE,
        isPaper: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Billings, Montana',
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getPersistenceGateway().isFileExists,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().getDocument,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(1);
    });

    it('should NOT append a clinic letter to the notice of receipt of petition if it DOES exist BUT the petitioner is NOT pro se', async () => {
      mockCase = {
        ...MOCK_CASE,
        isPaper: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Los Angeles, California',
        privatePractitioners: [
          {
            barNumber: '123456789',
            name: 'Test Private Practitioner',
            practitionerId: '123456789',
            practitionerType: 'privatePractitioner',
            representing: [getContactPrimary(MOCK_CASE).contactId],
            role: 'privatePractitioner',
            userId: '130c6634-4c3d-4cda-874c-d9a9387e00e2',
          },
        ],
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getPersistenceGateway().isFileExists,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().getDocument,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(1);
    });

    it('should append a clinic letter to both notice of receipt of petitions when there are two pro se petitioners at different addresses', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(true);

      const primaryContactNotr = getFakeFile(true, true);
      const secondaryContactNotr = getFakeFile(true);

      applicationContext
        .getDocumentGenerators()
        .noticeOfReceiptOfPetition.mockReturnValueOnce(primaryContactNotr);

      mockCase = {
        ...MOCK_CASE,
        contactSecondary: {
          ...getContactPrimary(MOCK_CASE),
          address1: '123 A Different Street',
          contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
          contactSecondary: CONTACT_TYPES.secondary,
          name: 'Test Petitioner Secondary',
        },
        isPaper: false,
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Los Angeles, California',
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(2);

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalledTimes(3);

      const actualPrimaryContactNotr =
        applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0]
          .firstPdf;
      expect(actualPrimaryContactNotr).toEqual(primaryContactNotr);

      const actualSecondaryContactNotr =
        applicationContext.getUtilities().combineTwoPdfs.mock.calls[1][0]
          .firstPdf;
      expect(actualSecondaryContactNotr).toEqual(secondaryContactNotr);
    });

    it('should append a clinic letter to one notice of receipt of petition when there are two petitioners at different addresses but one has representation', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(true);

      const secondaryContactId = 'f30c6634-4c3d-4cda-874c-d9a9387e00e2';
      mockCase = {
        ...MOCK_CASE,
        contactSecondary: {
          ...getContactPrimary(MOCK_CASE),
          address1: '123 A Different Street',
          contactId: secondaryContactId,
          name: 'Test Petitioner Secondary',
        },
        isPaper: false,
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Los Angeles, California',
        privatePractitioners: [
          {
            barNumber: '123456789',
            name: 'Test Private Practitioner',
            practitionerId: '123456789',
            practitionerType: 'privatePractitioner',
            representing: [secondaryContactId],
            role: 'privatePractitioner',
            userId: '130c6634-4c3d-4cda-874c-d9a9387e00e2',
          },
        ],
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(2);

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalledTimes(2);
    });

    it('should append a clinic letter to the one notice of receipt of petition when there are two pro se petitioners at the same addresses', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(true);

      mockCase = {
        ...MOCK_CASE,
        contactSecondary: {
          ...getContactPrimary(MOCK_CASE),
          contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
          name: 'Test Petitioner Secondary',
        },
        isPaper: false,
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Los Angeles, California',
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(1);

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalledTimes(1);
    });

    it('should not append a clinic letter to the one notice of receipt of petition when there are two petitioners at the same addresses with one having representation', async () => {
      applicationContext
        .getPersistenceGateway()
        .isFileExists.mockReturnValueOnce(true);

      let secondaryContactId = 'f30c6634-4c3d-4cda-874c-d9a9387e00e2';
      mockCase = {
        ...MOCK_CASE,
        contactSecondary: {
          ...getContactPrimary(MOCK_CASE),
          contactId: secondaryContactId,
          name: 'Test Petitioner Secondary',
        },
        isPaper: false,
        partyType: PARTY_TYPES.petitionerSpouse,
        preferredTrialCity: 'Los Angeles, California',
        privatePractitioners: [
          {
            barNumber: '123456789',
            name: 'Test Private Practitioner',
            practitionerId: '123456789',
            practitionerType: 'privatePractitioner',
            representing: [secondaryContactId],
            role: 'privatePractitioner',
            userId: '130c6634-4c3d-4cda-874c-d9a9387e00e2',
          },
        ],
        procedureType: 'Regular',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      };

      await serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });

      expect(
        applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
      ).toHaveBeenCalledTimes(1);

      expect(
        applicationContext.getUtilities().combineTwoPdfs,
      ).toHaveBeenCalledTimes(0);
    });
  });

  it('should have the same contact id on contactPrimary before and after serving the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.petitioners[0].contactId,
    ).toBe(MOCK_CASE.petitioners[0].contactId);
  });

  it('should generate a notice of receipt of petition document and upload it to s3', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalled();
  });

  it('should generate an OAP with a form appended to it when orderForAmendedPetition is true', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForAmendedPetition: true,
      orderForFilingFee: false,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0],
    ).toMatchObject({
      systemGeneratedDocument: {
        documentTitle: 'Order',
        documentType: 'Order for Amended Petition',
        eventCode: 'OAP',
      },
    });
  });

  it('should not generate an OAP with a form appended to it when orderForAmendedPetition is false', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForAmendedPetition: false,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder,
    ).not.toHaveBeenCalled();
  });

  it('should not return a paper service pdf when the case is electronic', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };

    const result = await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toBeUndefined();
  });

  it('should return a paper service pdf when the case is paper', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };

    const result = await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toBeDefined();
  });

  it('should mark the Petition docketEntry as served', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
    expect(
      updatedCase.docketEntries.find(p => p.eventCode === 'P').servedAt,
    ).toBeDefined();
  });

  it('should set isOnDocketRecord true for all initially filed documents except for the petition and stin file', async () => {
    const mockCaseWithoutServedDocketEntries = {
      ...MOCK_CASE,
      docketEntries: [
        MOCK_CASE.docketEntries[0],
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'ea10afeb-f189-4657-a862-c607a091beaa',
          docketNumber: '101-18',
          documentTitle:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          filedByRole: ROLES.petitioner,
          isFileAttached: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };
    const mockCaseWithServedDocketEntries = {
      ...mockCaseWithoutServedDocketEntries,
      docketEntries: [
        MOCK_CASE.docketEntries[0],
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'ea10afeb-f189-4657-a862-c607a091beaa',
          docketNumber: '101-18',
          documentTitle:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          filedByRole: ROLES.petitioner,
          index: 2,
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(
        mockCaseWithoutServedDocketEntries,
      )
      .mockReturnValueOnce(mockCase)
      .mockReturnValueOnce(mockCaseWithServedDocketEntries)
      .mockReturnValueOnce(mockCaseWithServedDocketEntries);

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries,
    ).toMatchObject([
      {
        documentTitle: INITIAL_DOCUMENT_TYPES.petition.documentTitle,
        index: 1,
        isOnDocketRecord: true,
      },
      {
        documentTitle:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
        index: 2,
        isOnDocketRecord: true,
      },
      {
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfReceiptOfPetition
            .documentTitle,
        index: 3,
        isOnDocketRecord: true,
      },
    ]);
  });

  it('should serve the NOTR to parties on the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: {
        ...getContactPrimary(MOCK_CASE),
        contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
        name: 'Test Petitioner Secondary',
      },
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };
    const MOCK_NOTR_ID = 'ea10afeb-f189-4657-a862-c607a091beaa';
    applicationContext.getUniqueId.mockReturnValue(MOCK_NOTR_ID);
    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0].docketEntryId,
    ).toEqual(MOCK_NOTR_ID);
  });

  it('should call serveCaseDocument for every initially filed document', async () => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APW',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUtilities().serveCaseDocument,
    ).toHaveBeenCalledTimes(Object.keys(INITIAL_DOCUMENT_TYPES).length);
  });

  it('should generate an order and upload it to s3 for noticeOfAttachments', async () => {
    mockCase = {
      ...MOCK_CASE,
      noticeOfAttachments: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();
    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
  });

  it('should generate an order and upload it to s3 for orderDesignatingPlaceOfTrial', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderDesignatingPlaceOfTrial: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      documentTitle: 'Order',
      documentType: 'Order',
      eventCode: 'O',
    });

    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();

    const petitionFilingDate = mockCase.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    ).filingDate;
    const expectedFilingDate = formatDateString(
      petitionFilingDate,
      FORMATS.MONTH_DAY_YEAR,
    );

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining(expectedFilingDate),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining(MOCK_CASE.procedureType.toLowerCase()),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining('TRIAL_LOCATION'),
    });
  });

  it('should generate an order and upload it to s3 for orderToShowCause', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderToShowCause: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();
    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
  });

  it('should replace brackets in orderToShowCause content with a filing date and todayPlus60', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderToShowCause: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.not.stringContaining('['),
    });

    const petitionFilingDate = mockCase.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    ).filingDate;
    const expectedFilingDate = formatDateString(
      petitionFilingDate,
      FORMATS.MONTH_DAY_YEAR,
    );

    const mockTodayPlus60 = getBusinessDateInFuture({
      numberOfDays: 60,
      startDate: formatNow(FORMATS.ISO),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining(expectedFilingDate),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining(mockTodayPlus60),
    });
  });

  it('should replace brackets in orderForAmendedPetition content with the filed date of the petition, and today plus sixty twice', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForAmendedPetition: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.not.stringContaining('['),
    });

    const petitionFilingDate = mockCase.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    ).filingDate;
    const expectedFilingDate = formatDateString(
      petitionFilingDate,
      FORMATS.MONTH_DAY_YEAR,
    );

    const mockTodayPlus60 = getBusinessDateInFuture({
      numberOfDays: 60,
      startDate: formatNow(FORMATS.ISO),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: `&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on ${expectedFilingDate}, a document as the petition of the above-named petitioner(s) at the docket number indicated. That docket number MUST appear on all documents and papers subsequently sent to the Court for filing or otherwise. The document did not comply with the Rules of the Court as to the form and content of a proper petition. <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;ORDERED that on or before ${mockTodayPlus60}, petitioner(s) shall file a proper amended petition. If, by ${mockTodayPlus60}, petitioner(s) do not file an Amended Petition, the case will be dismissed or other action taken as the Court deems appropriate.`,
    });
  });

  it('should replace brackets in orderForAmendedPetitionAndFilingFee content with the filing date of the petition, and today plus thirty twice', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForAmendedPetitionAndFilingFee: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.not.stringContaining('['),
    });

    const petitionFilingDate = mockCase.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    ).filingDate;
    const expectedFilingDate = formatDateString(
      petitionFilingDate,
      FORMATS.MONTH_DAY_YEAR,
    );

    const todayPlus30 = getBusinessDateInFuture({
      numberOfDays: 30,
      startDate: formatNow(FORMATS.ISO),
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: `&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on ${expectedFilingDate}, a document as the petition of the above-named
      petitioner(s) at the docket number indicated. That docket number MUST appear on all documents
      and papers subsequently sent to the Court for filing or otherwise. The document did not comply with
      the Rules of the Court as to the form and content of a proper petition. The filing fee was not paid.<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;ORDERED that on or before ${todayPlus30}, petitioner(s) shall file a proper
      amended petition and pay the $60.00 filing fee. Waiver of the filing fee requires an affidavit
      containing specific financial information regarding the inability to make such payment. An
      Application for Waiver of Filing Fee and Affidavit form is available under "Case Related Forms" on
      the Court's website at www.ustaxcourt.gov/case_related_forms.html.<br/>
      <br/>
      If, by ${todayPlus30}, petitioner(s) do not file an Amended Petition and either pay the Court's
      $60.00 filing fee or submit an Application for Waiver of the Filing Fee, the case will be dismissed or
      other action taken as the Court deems appropriate.`,
    });
  });

  it('should underline "See" in orderToShowCause content', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderToShowCause: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining('<u>See</u>'),
    });
  });

  it('should generate an order, upload it to s3, and remove brackets from orderContent for orderForFilingFee', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForFilingFee: true,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();
    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.not.stringContaining('['),
    });

    const mockTodayPlus30 = getBusinessDateInFuture({
      numberOfDays: 30,
      startDate: formatNow(FORMATS.ISO),
    });
    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: expect.stringContaining(mockTodayPlus30),
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should generate a notice of receipt of petition with the name and title of the clerk of the court', async () => {
    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[0][0].data,
    ).toMatchObject({
      nameOfClerk: 'James Bond',
      titleOfClerk: 'Clerk of the Court (Interim)',
    });
  });

  it('should generate a second notice of receipt of petition with the name and title of the clerk of the court', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          address1: '123 Side St',
          city: 'Somewhere Else',
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner Secondary',
          phone: '1234547',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'TN',
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data,
    ).toMatchObject({
      nameOfClerk: 'James Bond',
      titleOfClerk: 'Clerk of the Court (Interim)',
    });
  });
});
