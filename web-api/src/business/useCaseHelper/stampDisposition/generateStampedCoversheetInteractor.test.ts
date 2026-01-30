import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOTION_DISPOSITIONS } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateStampedCoversheetInteractor } from './generateStampedCoversheetInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockPetitionerUser } from '@shared/test/mockAuthUsers';

describe('generateStampedCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Motion',
        eventCode: 'M102',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        servedAt: '2019-04-19T14:45:15.595Z',
      },
    ],
  };

  const mockStampedDocketEntryId = 'f0ebf166-1dda-4c72-a540-21e883061611';
  const mockStampData = {
    customText: 'yeehaw',
    disposition: MOTION_DISPOSITIONS.GRANTED,
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should clear servedAt from the motion docket entry used for coversheet generation', async () => {
    await generateStampedCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        stampData: mockStampData,
        stampedDocketEntryId: mockStampedDocketEntryId,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getDocumentGenerators().coverSheet.mock.calls[0][0]
        .data.dateServed,
    ).toEqual('');
  });

  it('should generate a stamped coversheet pdf document with stampData', async () => {
    await generateStampedCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        stampData: mockStampData,
        stampedDocketEntryId: mockStampedDocketEntryId,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          stamp: mockStampData,
        }),
      }),
    );
  });

  it('should save the stamped coversheet', async () => {
    await generateStampedCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        stampData: {},
        stampedDocketEntryId: mockStampedDocketEntryId,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({ key: mockStampedDocketEntryId });
  });
});
