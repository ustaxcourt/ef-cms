const {
  calculateISODate,
  createISODateString,
} = require('../utilities/DateHandler');
const {
  docketClerkUser,
  irsPractitionerUser,
  irsSuperuserUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} = require('../../test/mockUsers');
const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');
const {
  INITIAL_DOCUMENT_TYPES,
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
  const baseDocketEntry = MOCK_CASE.docketEntries.find(
    d => d.docketEntryId === 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
  );
  const stinDocketEntry = MOCK_CASE.docketEntries.find(
    d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
  );

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);

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
      userId: 'b5724655-1791-4a99-b0f6-f9bbe99c1db5',
    });

    await expect(
      getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  describe('petitioner not associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('throw unauthorized error if user is not associated with case', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('throw unauthorized error for a petitioner who is not associated with the case and attempting to view case confirmation pdf', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: `case-${MOCK_CASE.docketNumber}-confirmation.pdf`,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('returns the expected policy url for a petitioner who is NOT associated with the case and viewing a court issued document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order that case is assigned',
        eventCode: 'O',
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the user is a petitioner and is attempting to view a stricken document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentTitle: 'Notice of Trial',
        documentType: 'Notice of Trial',
        eventCode: 'NTD',
        isStricken: true,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });

  describe('petitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('throw unauthorized error if user is associated with the case but the document is not available for viewing at this time', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2200-01-21T20:49:28.192Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing an available document', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });
      expect(url).toEqual('localhost');
    });

    it('throws a not found error for a petitioner who is associated with the case and viewing a document that is not on the docket record', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: '26258791-7a20-4a53-8e25-cc509b502cf3',
        }),
      ).rejects.toThrow(
        'Docket entry 26258791-7a20-4a53-8e25-cc509b502cf3 was not found.',
      );
    });

    it('throws a not found error for a petitioner who is associated with the case and viewing a document that does not have a file attached', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        isFileAttached: false,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow(
        `Docket entry ${baseDocketEntry.docketEntryId} does not have an attached file.`,
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
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order that case is assigned',
        eventCode: 'O',
        servedAt: undefined,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('throws an error for a petitioner who is associated with the case and is viewing a isLegacySealed document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order', // This is from courtIssuedEventCodes.json
        eventCode: 'O',
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing a served Stipulated Decision', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Stipulated Decision',
        eventCode: STIPULATED_DECISION_EVENT_CODE,
        isOnDocketRecord: true,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('returns the expected policy url for a petitioner who is associated with the case and viewing a case confirmation pdf', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: 'case-101-18-confirmation.pdf',
      });

      expect(url).toEqual('localhost');
    });

    it('throws an Unauthorized error for a petitioner attempting to access an case confirmation pdf for a different case', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber, //docket number is 101-18
          key: 'case-101-20-confirmation.pdf',
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an error when the user is a petitioner and is attempting to view the stin document', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });

  describe('private practitioner not associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        privatePractitionerUser,
      );
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('throws an error for a privatePractitioner who is not associated with the case and viewing an unserved court issued document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order that case is assigned',
        servedAt: undefined,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('does NOT throw an error for a privatePractitioner who is not associated with the case and viewing a legacy served court issued document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order that case is assigned',
        eventCode: 'OAJ',
        isLegacyServed: true,
        servedAt: undefined,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).resolves.toBeDefined();
    });

    it('throws an error for a privatePractitioner who is NOT associated with the case and viewing a served Stipulated Decision', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Stipulated Decision',
        eventCode: STIPULATED_DECISION_EVENT_CODE,
        isOnDocketRecord: true,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });
  });

  describe('private practitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        privatePractitionerUser,
      );
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('throws an error for a privatePractitioner who is associated with the case and is viewing a isLegacySealed document', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
        eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
        isLegacySealed: true,
        isOnDocketRecord: true,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('returns the expected policy url for a privatePractitioner who is associated with the case and viewing a served Stipulated Decision', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Stipulated Decision',
        eventCode: STIPULATED_DECISION_EVENT_CODE,
        isOnDocketRecord: true,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });
  });

  describe('petitions clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('returns the url for an internal user role even if verifyCaseForUser returns false', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should return the url when the user is a petitionsClerk, the case has not been served and is attempting to view the stin document', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: stinDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the user is a petitionsClerk, the case has been served and is attempting to view the stin document', async () => {
      mockCase.docketEntries[0].servedAt = '2019-08-25T05:00:00.000Z';

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view case documents at this time.');
    });
  });

  describe('docket clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    });

    it('should throw an error when the user is a docketClerk and is attempting to view the stin document', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
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

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: mockCorrespondenceId,
      });

      expect(url).toEqual('localhost');
    });
  });

  describe('irs superuser', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser);
    });

    it('throws an error if the user role is irsSuperuser and the petition document on the case is not served', async () => {
      mockCase.docketEntries[0] = {
        documentType: 'Petition',
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow(
        'Unauthorized to view case documents until the petition has been served.',
      );
    });

    it('returns the url if the user role is irsSuperuser and the petition document on the case is served', async () => {
      mockCase.docketEntries[0] = {
        docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        documentType: 'Petition',
        isFileAttached: true,
        servedAt: '2019-03-01T21:40:46.415Z',
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: '60814ae9-cd39-454a-9dc7-f5595a39988f',
      });

      expect(url).toEqual('localhost');
    });

    it('throw an error if the user role is irsSuperuser and the petition document on the case is served but the requested document does not have a file attached', async () => {
      mockCase.docketEntries[0] = {
        docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        documentType: 'Petition',
        isFileAttached: false,
        servedAt: '2019-03-01T21:40:46.415Z',
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        }),
      ).rejects.toThrow(
        'Docket entry 60814ae9-cd39-454a-9dc7-f5595a39988f does not have an attached file.',
      );
    });

    it('throws a not found error if the user role is irsSuperuser and the petition document on the case is served but the document requested is not on the case', async () => {
      mockCase.docketEntries[0].servedAt = '2019-03-01T21:40:46.415Z';

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: '984fe4c3-7685-4d1e-9ad6-9914785e6dd6',
        }),
      ).rejects.toThrow(
        'Docket entry 984fe4c3-7685-4d1e-9ad6-9914785e6dd6 was not found.',
      );
    });
  });

  describe('irs practitioner associated with the case', () => {
    const aShortTimeAgo = calculateISODate({
      dateString: createISODateString(),
      howMuch: -12,
      units: 'hours',
    });

    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(irsPractitionerUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('should not throw an error if the user is associated with the case and the document meets age requirements', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        date: '2000-01-21T20:49:28.192Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        isFileAttached: true,
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error if the user is associated with the case and the document does not meet age requirements', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        date: aShortTimeAgo,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        isFileAttached: true,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  });
});
