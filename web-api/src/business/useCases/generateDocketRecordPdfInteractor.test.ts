import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  MOTION_DISPOSITIONS,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_PRACTITIONER,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

describe('generateDocketRecordPdfInteractor', () => {
  const mockId = '12345';
  const mockPdfUrlAndID = { fileId: mockId, url: 'www.example.com' };
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseCaption: 'Test Case Caption',
      docketEntries: [
        {
          docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
        },
        {
          docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
        },
        {
          additionalInfo2: 'Additional Info 2',
          docketEntryId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
          isStatusServed: true,
          servedAtFormatted: '03/27/19',
        },
      ],
      docketNumber: '123-45',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      irsPractitioners: [],
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: 'address 1',
          city: 'City',
          contactId: '98956b46-1757-4337-9f7c-58801eba2e99',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '123-123-1234',
          postalCode: '12345',
          state: 'AL',
        },
      ],
      privatePractitioners: [],
    };

    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
    getCaseByDocketNumber.mockResolvedValue(caseDetail);
    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(({ contentHtml }) => {
        return contentHtml;
      });
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrlAndID);
    applicationContext.getUniqueId.mockReturnValue(mockId);
  });

  it('Calls docketRecord document generator to build a PDF', async () => {
    await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: true });
  });

  it('calls docketRecord document generator with formatted counsel for all petitioners on a case', async () => {
    const mockPractitionerOnCase = {
      ...MOCK_PRACTITIONER,
      representing: [caseDetail.petitioners[0].contactId],
    };

    caseDetail.privatePractitioners = [mockPractitionerOnCase, {}];

    await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data.caseDetail.petitioners[0].counselDetails[0],
    ).toMatchObject({
      email: 'ab@example.com',
      name: 'Test Attorney (AB1111)',
      phone: '+1 (555) 555-5555',
    });
  });

  it('sets counsel name to `None` when there is no counsel representing the petitioner', async () => {
    const mockPractitionerOnCase = {
      ...privatePractitionerUser,
      email: 'privatePractitioner@example.com',
      representing: ['b4302f61-2cff-4a57-bacf-1f817ffbaf8d'],
    };

    caseDetail.privatePractitioners = [mockPractitionerOnCase, {}];

    await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      },
      mockPractitionerOnCase,
    );

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data.caseDetail.petitioners[0].counselDetails[0],
    ).toMatchObject({
      name: 'None',
    });
  });

  it('Returns a file ID and url to the generated file', async () => {
    const result = await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
        includePartyDetail: true,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalled();
    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('defaults includePartyDetail to false when a value has not been provided', async () => {
    await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: false });
  });

  it('throws an Unauthorized error for an unassociated user attempting to view a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    getCaseByDocketNumber.mockResolvedValue({
      ...caseDetail,
      isSealed: true,
      privatePractitioners: [],
      sealedDate: '2019-09-19T16:42:00.000Z',
    });

    await expect(
      generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('throws an Unauthorized error for a public user attempting to view a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    getCaseByDocketNumber.mockResolvedValue({
      ...caseDetail,
      sealedDate: '2019-08-25T05:00:00.000Z',
    });

    await expect(
      generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('returns a PDF url for an internal user attempting to view a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    getCaseByDocketNumber.mockResolvedValue({
      ...caseDetail,
      sealedDate: '2019-08-25T05:00:00.000Z',
    });

    const result = await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
      } as any,
      mockPetitionsClerkUser,
    );

    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('returns a PDF url for an external, associated user attempting to view a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
    getCaseByDocketNumber.mockResolvedValue({
      ...caseDetail,
      userId: petitionerUser.userId,
    });

    const result = await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
      } as any,
      mockPetitionerUser,
    );

    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('returns a PDF url for an external, indirectly associated user attempting to view a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    getCaseByDocketNumber.mockResolvedValue({
      ...caseDetail,
      userId: petitionerUser.userId,
    });

    const result = await generateDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: caseDetail.docketNumber,
        isIndirectlyAssociated: true,
      } as any,
      mockPetitionerUser,
    );

    expect(result).toEqual(mockPdfUrlAndID);
  });

  describe('sorting', () => {
    it('should pass in entries sorted by the provided property and orderType "asc"', async () => {
      caseDetail.docketEntries = [
        {
          eventCode: 'D',
          isOnDocketRecord: true,
        },
        { eventCode: 'B', isOnDocketRecord: true },
        { eventCode: 'C', isOnDocketRecord: true },
        { eventCode: 'A', isOnDocketRecord: true },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
          docketRecordTableSort: { sortField: 'eventCode', sortOrder: 'asc' },
          isIndirectlyAssociated: true,
        } as any,
        mockPetitionerUser,
      );

      const docketRecordCalls =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls;
      expect(docketRecordCalls.length).toEqual(1);

      const {
        data: { entries },
      } = docketRecordCalls[0][0];
      expect(entries).toMatchObject([
        {
          eventCode: 'A',
        },
        { eventCode: 'B' },
        { eventCode: 'C' },
        { eventCode: 'D' },
      ]);
    });

    it('should pass in entries sorted by the provided property and orderType "des"', async () => {
      caseDetail.docketEntries = [
        {
          attachments: 'TEST_attachments',
          documentTitle: 'TEST_D',
          eventCode: 'D',
          filingDate: '2019-08-25T05:00:00.000Z',
          isOnDocketRecord: true,
          isUnservable: true,
        },
        { eventCode: 'B', isOnDocketRecord: true },
        { eventCode: 'C', isOnDocketRecord: true },
        { eventCode: 'A', isOnDocketRecord: true },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
          docketRecordTableSort: { sortField: 'eventCode', sortOrder: 'desc' },
          isIndirectlyAssociated: true,
        } as any,
        mockPetitionerUser,
      );

      const docketRecordCalls =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls;
      expect(docketRecordCalls.length).toEqual(1);

      const {
        data: { entries },
      } = docketRecordCalls[0][0];
      expect(entries).toMatchObject([
        {
          createdAtFormatted: '08/25/19',
          descriptionDisplay: 'TEST_D (Attachment(s))',
          eventCode: 'D',
          filingsAndProceedings: '(Attachment(s))',
        },
        { eventCode: 'C' },
        { eventCode: 'B' },
        {
          eventCode: 'A',
        },
      ]);
    });

    it('should default numberOfPages to 0 to correctly sort the docket entries', async () => {
      caseDetail.docketEntries = [
        { index: 1, isOnDocketRecord: true, numberOfPages: 1 },
        { index: 2, isOnDocketRecord: true, numberOfPages: 3 },
        { index: 3, isOnDocketRecord: true, numberOfPages: undefined },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
          docketRecordTableSort: {
            sortField: 'numberOfPages',
            sortOrder: 'asc',
          },
          isIndirectlyAssociated: true,
        } as any,
        mockPetitionerUser,
      );

      const docketRecordCalls =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls;
      expect(docketRecordCalls.length).toEqual(1);

      const {
        data: { entries },
      } = docketRecordCalls[0][0];
      expect(entries).toMatchObject([
        { index: 3, isOnDocketRecord: true, numberOfPages: 0 },
        { index: 1, isOnDocketRecord: true, numberOfPages: 1 },
        { index: 2, isOnDocketRecord: true, numberOfPages: 3 },
      ]);
    });
  });

  describe('related docket entries', () => {
    it('should process affectedByDocketEntries for motions', async () => {
      caseDetail.docketEntries = [
        {
          docketEntryId: 'motion-id',
          index: 1,
          isOnDocketRecord: true,
        },
        {
          affectedByDocketEntries: [
            {
              docketEntryId: 'motion-id',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
          docketEntryId: 'order-id',
          index: 2,
          isOnDocketRecord: true,
        },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        mockDocketClerkUser,
      );

      const generatedData =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data;
      const orderEntry = generatedData.caseDetail.formattedDocketEntries.find(
        e => e.docketEntryId === 'order-id',
      );

      expect(orderEntry.relatedDocketEntries).toHaveLength(1);
      expect(orderEntry.relatedDocketEntries[0].docketEntryIndex).toEqual(1);
      expect(orderEntry.relatedDocketEntries[0].dispositionText[0]).toEqual(
        'GRANTED BY #1',
      );
    });

    it('should process affectedDocketEntries for orders', async () => {
      caseDetail.docketEntries = [
        {
          affectedDocketEntries: [
            {
              docketEntryId: 'affected-order-id',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
          docketEntryId: 'motion-id',
          index: 1,
          isOnDocketRecord: true,
        },
        {
          docketEntryId: 'affected-order-id',
          index: 2,
          isOnDocketRecord: true,
        },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        mockDocketClerkUser,
      );

      const generatedData =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data;
      const motionEntry = generatedData.caseDetail.formattedDocketEntries.find(
        e => e.docketEntryId === 'motion-id',
      );

      expect(motionEntry.relatedDocketEntries).toHaveLength(1);
      expect(motionEntry.relatedDocketEntries[0].docketEntryIndex).toEqual(2);
      expect(motionEntry.relatedDocketEntries[0].dispositionText[0]).toEqual(
        'GRANTING #2',
      );
    });

    it('should combine both affectedByDocketEntries and affectedDocketEntries', async () => {
      caseDetail.docketEntries = [
        {
          docketEntryId: 'motion-id',
          index: 1,
          isOnDocketRecord: true,
        },
        {
          affectedByDocketEntries: [
            {
              docketEntryId: 'motion-id',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
          affectedDocketEntries: [
            {
              docketEntryId: 'order-id',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
          docketEntryId: 'entry-with-both',
          index: 2,
          isOnDocketRecord: true,
        },
        {
          docketEntryId: 'order-id',
          index: 3,
          isOnDocketRecord: true,
        },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        mockDocketClerkUser,
      );

      const generatedData =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data;
      const entry = generatedData.caseDetail.formattedDocketEntries.find(
        e => e.docketEntryId === 'entry-with-both',
      );

      expect(entry.relatedDocketEntries).toHaveLength(2);
      expect(entry.relatedDocketEntries[0].dispositionText[0]).toEqual(
        'GRANTED BY #1',
      );
      expect(entry.relatedDocketEntries[1].dispositionText[0]).toEqual(
        'GRANTING #3',
      );
    });

    it('should initialize relatedDocketEntries as empty array when no related entries exist', async () => {
      caseDetail.docketEntries = [
        {
          docketEntryId: 'simple-entry',
          index: 1,
          isOnDocketRecord: true,
        },
      ];

      await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: caseDetail.docketNumber,
        } as any,
        mockDocketClerkUser,
      );

      const generatedData =
        applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
          .data;
      const entry = generatedData.caseDetail.formattedDocketEntries[0];

      expect(entry.relatedDocketEntries).toEqual([]);
    });
  });
});
