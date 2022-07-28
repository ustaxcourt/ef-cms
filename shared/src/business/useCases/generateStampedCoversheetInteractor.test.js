const {
  generateStampedCoversheetInteractor,
} = require('./generateStampedCoversheetInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOTION_DISPOSITIONS } = require('../entities/EntityConstants');

describe('generateStampedCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
      },
    ],
  };

  const mockStampedDocketEntryId = 'f0ebf166-1dda-4c72-a540-21e883061611';
  const mockStampData = {
    customText: 'yeehaw',
    disposition: MOTION_DISPOSITIONS.GRANTED,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('generates a stamped coversheet pdf document with stampData', async () => {
    await generateStampedCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      stampData: mockStampData,
      stampedDocketEntryId: mockStampedDocketEntryId,
    });

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
    await generateStampedCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      stampData: {},
      stampedDocketEntryId: mockStampedDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({ key: mockStampedDocketEntryId });
  });
});
