const {
  calculateISODate,
  createISODateString,
} = require('../utilities/DateHandler');
const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');
const {
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('getDownloadPolicyUrlInteractor', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);

    mockCase.docketEntries.push({
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3858',
      docketNumber: '101-18',
      documentTitle: 'Notice of Trial',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      filedBy: 'Test Petitioner',
      index: 6,
      isFileAttached: true,
      isStricken: true,
      processingStatus: 'pending',
      servedAt: '2019-08-25T05:00:00.000Z',
      servedParties: [],
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue('localhost');
  });

  it('throw unauthorized error on invalid role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'petitioner',
    });

    await expect(
      getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  describe('petitioner not associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitioner,
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('throw unauthorized error if user is not associated with case', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('throw unauthorized error for a petitioner who is not associated with the case and attempting to view case confirmation pdf', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: `case-${mockCase.docketNumber}-confirmation.pdf`,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('returns the expected policy url for a petitioner who is NOT associated with the case and viewing a court issued document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Order that case is assigned',
              eventCode: 'O',
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the user is a petitioner and is attempting to view a stricken document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3858',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });

  describe('petitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitioner,
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('throw unauthorized error if user is associated with the case but the document is not available for viewing at this time', async () => {
      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2200-01-21T20:49:28.192Z',
        docketEntryId: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
        docketNumber: '101-18',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        isFileAttached: true,
        processingStatus: 'pending',
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing an available document', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
      expect(url).toEqual('localhost');
    });

    it('throws a not found error for a petitioner who is associated with the case and viewing a document that is not on the docket record', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: '26258791-7a20-4a53-8e25-cc509b502cf3',
        }),
      ).rejects.toThrow(
        'Docket entry 26258791-7a20-4a53-8e25-cc509b502cf3 was not found.',
      );
    });

    it('throws a not found error for a petitioner who is associated with the case and viewing a document that does not have a file attached', async () => {
      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        docketEntryId: '8205c4bc-879f-4648-a3ba-9280384c4c00',
        docketNumber: '101-18',
        documentTitle: 'Request for Place of Trial',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        isFileAttached: false,
      });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: '8205c4bc-879f-4648-a3ba-9280384c4c00',
        }),
      ).rejects.toThrow(
        'Docket entry 8205c4bc-879f-4648-a3ba-9280384c4c00 does not have an attached file.',
      );
    });

    it('throws a not found error for a case that is not found', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({ docketEntries: [] });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: '123-20',
          key: '26258791-7a20-4a53-8e25-cc509b502cf3',
        }),
      ).rejects.toThrow('Case 123-20 was not found.');
    });

    it('throws an error for a petitioner who is associated with the case and viewing an unserved court issued document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Order that case is assigned',
              eventCode: 'O',
              servedAt: undefined,
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('throws an error for a petitioner who is associated with the case and is viewing a isLegacySealed document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Order', // This is from courtIssuedEventCodes.json
              eventCode: 'O',
              isLegacySealed: true,
              isOnDocketRecord: true,
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing a served Stipulated Decision', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Stipulated Decision',
              eventCode: STIPULATED_DECISION_EVENT_CODE,
              isOnDocketRecord: true,
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(url).toEqual('localhost');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing a case confirmation pdf', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'case-101-18-confirmation.pdf',
      });

      expect(url).toEqual('localhost');
    });

    it('throws an Unauthorized error for a petitioner attempting to access an case confirmation pdf for a different case', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber, //docket number is 101-18
          key: 'case-101-20-confirmation.pdf',
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an error when the user is a petitioner and is attempting to view the stin document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });

  describe('private practitioner not associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.privatePractitioner,
        userId: 'privatePractitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('throws an error for a privatePractitioner who is not associated with the case and viewing an unserved court issued document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Order that case is assigned',
              servedAt: undefined,
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('does NOT throw an error for a privatePractitioner who is not associated with the case and viewing a legacy served court issued document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Order that case is assigned',
              eventCode: 'OAJ',
              isLegacyServed: true,
              servedAt: undefined,
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).resolves.toBeDefined();
    });

    it('throws an error for a privatePractitioner who is NOT associated with the case and viewing a served Stipulated Decision', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Stipulated Decision',
              eventCode: STIPULATED_DECISION_EVENT_CODE,
              isOnDocketRecord: true,
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });
  });

  describe('private practitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.privatePractitioner,
        userId: 'privatePractitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('throws an error for a privatePractitioner who is associated with the case and is viewing a isLegacySealed document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType:
                NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
              eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
              isLegacySealed: true,
              isOnDocketRecord: true,
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a privatePractitioner who is associated with the case and viewing a served Stipulated Decision', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...mockCase,
          docketEntries: [
            {
              ...mockCase.docketEntries.filter(
                d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              )[0],
              documentType: 'Stipulated Decision',
              eventCode: STIPULATED_DECISION_EVENT_CODE,
              isOnDocketRecord: true,
              servedAt: applicationContext.getUtilities().createISODateString(),
            },
          ],
        });

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(url).toEqual('localhost');
    });
  });

  describe('petitions clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitionsClerk,
        userId: 'petitionsClerk',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('returns the url for an internal user role even if verifyCaseForUser returns false', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(url).toEqual('localhost');
    });

    it('should return the url when the user is a petitionsClerk, the case has not been served and is attempting to view the stin document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the user is a petitionsClerk, the case has been served and is attempting to view the stin document', async () => {
      mockCase.docketEntries.map(entry => {
        if (entry.documentType === 'Petition') {
          entry.servedAt = applicationContext
            .getUtilities()
            .createISODateString();
        }
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view case documents at this time.');
    });
  });

  describe('docket clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.docketClerk,
        userId: 'docketClerk',
      });
    });

    it('should throw an error when the user is a docketClerk and is attempting to view the stin document', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow('Unauthorized to view case documents at this time.');
    });

    it('should return the url when the user is a docketClerk and is attempting to view a correspondence document', async () => {
      const mockCorrespondenceId = applicationContext.getUniqueId();
      mockCase.correspondence = [
        {
          correspondenceId: mockCorrespondenceId,
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: mockCorrespondenceId,
      });

      expect(url).toEqual('localhost');
    });
  });

  describe('irs superuser', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.irsSuperuser,
        userId: 'irsSuperuser',
      });
    });

    it('throws an error if the user role is irsSuperuser and the petition document on the case is not served', async () => {
      mockCase.docketEntries = [
        {
          documentType: 'Petition',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow(
        'Unauthorized to view case documents until the petition has been served.',
      );
    });

    it('returns the url if the user role is irsSuperuser and the petition document on the case is served', async () => {
      mockCase.docketEntries = [
        {
          docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
          documentType: 'Petition',
          isFileAttached: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: '60814ae9-cd39-454a-9dc7-f5595a39988f',
      });

      expect(url).toEqual('localhost');
    });

    it('throw an error if the user role is irsSuperuser and the petition document on the case is served but the requested document does not have a file attached', async () => {
      mockCase.docketEntries = [
        {
          docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
          documentType: 'Petition',
          isFileAttached: false,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        }),
      ).rejects.toThrow(
        'Docket entry 60814ae9-cd39-454a-9dc7-f5595a39988f does not have an attached file.',
      );
    });

    it('throws a not found error if the user role is irsSuperuser and the petition document on the case is served but the document requested is not on the case', async () => {
      mockCase.docketEntries = [
        {
          docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
          documentType: 'Petition',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        }),
      ).rejects.toThrow(
        'Docket entry def81f4d-1e47-423a-8caf-6d2fdc3d3859 was not found.',
      );
    });
  });

  describe('irs practitioner associated with the case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.irsPractitioner,
        userId: 'irsPractitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('should not throw an error if the user is associated with the case and the document is a transcript > 90 days old', async () => {
      const mockDocketEntryId = applicationContext.getUniqueId();

      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2000-01-21T20:49:28.192Z',
        docketEntryId: mockDocketEntryId,
        docketNumber: '101-18',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        isFileAttached: true,
        processingStatus: 'pending',
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: mockDocketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should not throw an error if the user is associated with the case and the document is a legacy transcript > 90 days old', async () => {
      const mockDocketEntryId = applicationContext.getUniqueId();

      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        date: undefined,
        docketEntryId: mockDocketEntryId,
        docketNumber: '101-18',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filingDate: '2000-01-21T20:49:28.192Z',
        isFileAttached: true,
        isLegacy: true,
        processingStatus: 'pending',
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        key: mockDocketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error if the user is associated with the case and the document is a transcript < 90 days old', async () => {
      const mockDocketEntryId = applicationContext.getUniqueId();
      const aShortTimeAgo = calculateISODate({
        dateString: createISODateString(),
        howMuch: -12,
        units: 'hours',
      });

      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        date: aShortTimeAgo,
        docketEntryId: mockDocketEntryId,
        docketNumber: '101-18',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        isFileAttached: true,
        processingStatus: 'pending',
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: mockDocketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });

    it('should throw an error if the user is associated with the case and the document is a legacy transcript < 90 days old', async () => {
      const mockDocketEntryId = applicationContext.getUniqueId();
      const aShortTimeAgo = calculateISODate({
        dateString: createISODateString(),
        howMuch: -12,
        units: 'hours',
      });

      mockCase.docketEntries.push({
        createdAt: '2018-01-21T20:49:28.192Z',
        date: undefined,
        docketEntryId: mockDocketEntryId,
        docketNumber: '101-18',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filingDate: aShortTimeAgo,
        isFileAttached: true,
        isLegacy: true,
        processingStatus: 'pending',
        userId: 'petitioner',
      });
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCase);

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: mockCase.docketNumber,
          key: mockDocketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });
});
