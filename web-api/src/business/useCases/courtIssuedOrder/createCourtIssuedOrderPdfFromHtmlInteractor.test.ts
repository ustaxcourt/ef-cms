import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from './createCourtIssuedOrderPdfFromHtmlInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

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

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });
  });

  it('throws an error if the user is not authorized', async () => {
    await expect(
      createCourtIssuedOrderPdfFromHtmlInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('fetches the case by id', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {} as any,
      mockDocketClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('calls the pdf document generator function', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {} as any,
      mockDocketClerkUser,
    );
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
      {} as any,
      mockDocketClerkUser,
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
      } as any,
      mockDocketClerkUser,
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

  it('calls the generate the order pdf with the defined name and title of the clerk for NOT event codes', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        eventCode: 'NOT',
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nameOfClerk: 'James Bond',
          titleOfClerk: 'Clerk of the Court (Interim)',
        }),
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });

  it('calls the generate the order pdf WITHOUT a defined name or title of the clerk for non-NOT event codes', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        eventCode: 'O',
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getConfigurationItemValue,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nameOfClerk: '',
          titleOfClerk: '',
        }),
      }),
    );
  });
});
