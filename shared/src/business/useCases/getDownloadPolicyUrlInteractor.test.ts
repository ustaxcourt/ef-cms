/* eslint-disable max-lines */
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  INITIAL_DOCUMENT_TYPES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  calculateISODate,
  createISODateString,
} from '../utilities/DateHandler';
import { cloneDeep } from 'lodash';
import {
  docketClerkUser,
  irsPractitionerUser,
  irsSuperuserUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '../../test/mockUsers';
import { getDownloadPolicyUrlInteractor } from './getDownloadPolicyUrlInteractor';

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

  it('should throw unauthorized error when the users role is invalid', async () => {
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

  describe('when the user is a petitioner not associated with case or the consolidated group', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('should throw an unauthorized error', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an unauthorized error when the document being viewed is the case confirmation pdf', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: `case-${MOCK_CASE.docketNumber}-confirmation.pdf`,
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an unauthorized error when the document is sealed to the public', async () => {
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);

      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2200-01-21T20:49:28.192Z',
        documentTitle: 'Order of [anything] on [date]',
        documentType: 'Order',
        eventCode: 'O',
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('should return the policy url when the document being viewed is a court issued document', async () => {
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

    it('should throw an error when the document being viewed is a stricken document', async () => {
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

    it('should throw an Unauthorized error for a petitioner attempting to access an case confirmation pdf for a different case', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber, //docket number is 101-18
          key: 'case-101-20-confirmation.pdf',
        }),
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('when the user is a petitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('should throw an unauthorized error when the document is not available for viewing at this time', async () => {
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

    it('should NOT receive the policy url when the document being viewed is a document that has been sealed to all external users', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order',
        eventCode: 'O',
        isOnDocketRecord: true,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('should NOT receive the policy url when the Non-Court issued document being viewed is sealed to all external users', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Answer',
        eventCode: 'A',
        isOnDocketRecord: true,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('should return the policy url when the doucument requested is an available document', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });
      expect(url).toEqual('localhost');
    });

    it('should return the policy url when the document requested is a document that has been sealed to the public', async () => {
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);

      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2200-01-21T20:49:28.192Z',
        documentTitle: 'Order of [anything] on [date]',
        documentType: 'Order',
        eventCode: 'O',
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });
      expect(url).toEqual('localhost');
    });

    it('should return the policy url when the doucument requested is an Answer that has been sealed to the public', async () => {
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);

      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        createdAt: '2018-01-21T20:49:28.192Z',
        date: '2200-01-21T20:49:28.192Z',
        documentTitle: 'Answer of [anything] on [date]',
        documentType: 'Answer',
        eventCode: 'A',
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });
      expect(url).toEqual('localhost');
    });

    it('should throw a not found error when the document requested is a document that is not on the docket record', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: '26258791-7a20-4a53-8e25-cc509b502cf3',
        }),
      ).rejects.toThrow(
        'Docket entry 26258791-7a20-4a53-8e25-cc509b502cf3 was not found.',
      );
    });

    it('should throw a not found error when the document requested is a document that does not have a file attached', async () => {
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

    it('should throw a not found error when the case the document belonds to is not found', async () => {
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

    it('should throw an error when the document requested is an unserved court issued document', async () => {
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

    it('should return the policy url when the document requested is a served Stipulated Decision', async () => {
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

    it('should return the policy url when the document requested is a case confirmation pdf', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: 'case-101-18-confirmation.pdf',
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the document requested is a STIN', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });

    it('should NOT throw an error when the document requested is a brief', async () => {
      const briefDocketEntryId = 'abb81f4d-1e47-423a-8caf-6d2fdc3d3859';
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          docketEntries: [
            {
              createdAt: '2009-11-21T20:49:28.192Z',
              docketEntryId: briefDocketEntryId,
              docketNumber: '101-18',
              documentTitle: 'Simultaneous Opening Brief',
              documentType: 'Simultaneous Opening Brief',
              draftOrderState: {},
              entityName: 'DocketEntry',
              eventCode: 'SIOB',
              filedBy: 'Test Petitioner',
              filers: [],
              filingDate: '2009-03-01T05:00:00.000Z',
              index: 6,
              isFileAttached: true,
              isMinuteEntry: false,
              isOnDocketRecord: true,
              pending: false,
              processingStatus: 'complete',
              receivedAt: '2009-03-01T05:00:00.000Z',
              stampData: {},
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        });

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: briefDocketEntryId,
      });

      expect(url).toEqual('localhost');
    });
  });

  describe('when the user is a private practitioner not associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        privatePractitionerUser,
      );
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('should throw an error when the document being viewed is an unserved court issued document', async () => {
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

    it('should NOT throw an error when the document being viewed is a legacy served court issued document', async () => {
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

    it('should throw an error when the document being viewed is a served Stipulated Decision', async () => {
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

  describe('when the user is a private practitioner associated with case', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(
        privatePractitionerUser,
      );
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(true);
    });

    it('should receive the policy url when the document being viewed is a document that has been sealed to the public', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
        eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
        isOnDocketRecord: true,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should NOT receive the policy url when the document being viewed is a document that has been sealed to all external users', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        documentType: 'Order',
        eventCode: 'O',
        isOnDocketRecord: true,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
        servedAt: applicationContext.getUtilities().createISODateString(),
      };

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: baseDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time');
    });

    it('should receive the policy url when the document being viewed is a served Stipulated Decision', async () => {
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

  describe('when the user is a petitions clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
      applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser.mockReturnValue(false);
    });

    it('should return the policy url for an internal user role even when verifyCaseForUser returns false', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should return the policy url when the case has not been served and the requested document is a STIN', async () => {
      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: stinDocketEntry.docketEntryId,
      });

      expect(url).toEqual('localhost');
    });

    it('should throw an error when the case has been served and is attempting to view the stin document', async () => {
      mockCase.docketEntries[0].servedAt = '2019-08-25T05:00:00.000Z';

      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view case documents at this time.');
    });
  });

  describe('when the user is a docket clerk', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    });

    it('should throw an error when the requested document is a STIN', async () => {
      await expect(
        getDownloadPolicyUrlInteractor(applicationContext, {
          docketNumber: MOCK_CASE.docketNumber,
          key: stinDocketEntry.docketEntryId,
        }),
      ).rejects.toThrow('Unauthorized to view case documents at this time.');
    });

    it('should return the policy url when the requested document is a correspondence', async () => {
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

  describe('when the user is a irs superuser', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser);
    });

    it('should throw an error when the petition document on the case is not served', async () => {
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

    it('should return the policy url when requested document is a petition on a served case', async () => {
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

    it('returns the url if the user role is irsSuperuser and the order is sealed', async () => {
      mockCase.docketEntries[0] = {
        docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        isSealed: true,
        sealedTo: 'Public',
        servedAt: '2019-03-01T21:40:46.415Z',
      };

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: '60814ae9-cd39-454a-9dc7-f5595a39988f',
      });

      expect(url).toEqual('localhost');
    });

    it('should receive the policy url when the document being viewed is a document that has been sealed to all external users', async () => {
      mockCase.docketEntries[0] = {
        ...baseDocketEntry,
        docketEntryId: '60814ae9-cd39-454a-9dc7-f5595a39988f',
        documentType: 'Order',
        eventCode: 'O',
        isOnDocketRecord: true,
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
        servedAt: applicationContext.getUtilities().createISODateString(),
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

  describe('when the user is a irs practitioner associated with the case', () => {
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

  describe('with CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER feature flag on', () => {
    const leadMockCase = {
      ...MOCK_CASE,
      leadDocketNumber: MOCK_CASE.docketNumber,
      petitioners: [{ ...petitionerUser, contactId: petitionerUser.userId }],
    };

    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      applicationContext
        .getUseCases()
        .getConsolidatedCasesByCaseInteractor.mockReturnValue([leadMockCase]);
    });

    it('should return the policy url when the document requested is an available document and user is associated with the consolidated group', async () => {
      applicationContext
        .getUseCases()
        .getFeatureFlagValueInteractor.mockResolvedValue(true);

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValueOnce(leadMockCase);

      const url = await getDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        key: baseDocketEntry.docketEntryId,
      });
      expect(url).toEqual('localhost');
    });
  });
});
