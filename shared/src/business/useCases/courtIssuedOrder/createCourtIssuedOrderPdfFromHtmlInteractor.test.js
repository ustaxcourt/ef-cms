const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  const mockPdfUrl = 'www.example.com';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45W',
      });

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '321',
    });
  });

  it('throws an error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '432',
    });

    await expect(
      createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('fetches the case by id', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {});
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('calls the pdf document generator function', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {});
    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          docketNumberWithSuffix: '123-45W',
        }),
      }),
    );
  });

  it('returns the pdf url from the temp documents bucket', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {},
    );

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalledWith(expect.objectContaining({ useTempBucket: true }));
    expect(result).toEqual(mockPdfUrl);
  });

  it('calls the generate the order pdf with the defined addedDocketNumbers', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        addedDocketNumbers: ['101-20'],
      },
    );

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ addedDocketNumbers: ['101-20'] }),
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });
});
