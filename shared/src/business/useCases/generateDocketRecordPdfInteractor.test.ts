import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '../entities/EntityConstants';
import {
  MOCK_PRACTITIONER,
  docketClerkUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { generateDocketRecordPdfInteractor } from './generateDocketRecordPdfInteractor';

describe('generateDocketRecordPdfInteractor', () => {
  const mockId = '12345';
  const mockPdfUrlAndID = { fileId: mockId, url: 'www.example.com' };

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

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => ({ ...caseDetail }));
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
    await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      includePartyDetail: true,
    });

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

    await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      includePartyDetail: true,
    });

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
      representing: ['b4302f61-2cff-4a57-bacf-1f817ffbaf8d'],
    };

    caseDetail.privatePractitioners = [mockPractitionerOnCase, {}];

    await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data.caseDetail.petitioners[0].counselDetails[0],
    ).toMatchObject({
      name: 'None',
    });
  });

  it('Returns a file ID and url to the generated file', async () => {
    const result = await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      includePartyDetail: true,
    });

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalled();
    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('defaults includePartyDetail to false when a value has not been provided', async () => {
    await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().docketRecord.mock.calls[0][0]
        .data,
    ).toMatchObject({ includePartyDetail: false });
  });

  it('throws an Unauthorized error for an unassociated user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        isSealed: true,
        privatePractitioners: [],
        sealedDate: '2019-09-19T16:42:00.000Z',
      });

    await expect(
      generateDocketRecordPdfInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
      } as any),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('throws an Unauthorized error for a public user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({}); //public user
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        sealedDate: '2019-08-25T05:00:00.000Z',
      });

    await expect(
      generateDocketRecordPdfInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
      } as any),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });

  it('returns a PDF url for an internal user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        sealedDate: '2019-08-25T05:00:00.000Z',
      });

    const result = await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    } as any);

    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('returns a PDF url for an external, associated user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        userId: petitionerUser.userId,
      });

    const result = await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    } as any);

    expect(result).toEqual(mockPdfUrlAndID);
  });

  it('returns a PDF url for an external, indirectly associated user attempting to view a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseDetail,
        userId: petitionerUser.userId,
      });

    const result = await generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      isIndirectlyAssociated: true,
    } as any);

    expect(result).toEqual(mockPdfUrlAndID);
  });
});
