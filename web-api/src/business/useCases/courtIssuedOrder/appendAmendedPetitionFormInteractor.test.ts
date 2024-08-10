import { AMENDED_PETITION_FORM_NAME } from '../../../../../shared/src/business/entities/EntityConstants';
import { appendAmendedPetitionFormInteractor } from './appendAmendedPetitionFormInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { testPdfDoc } from '@shared/business/test/getFakeFile';

describe('appendAmendedPetitionFormInteractor', () => {
  const returnedCombinedPdf = 'ever';
  const mockDocketEntryId = 'd594360c-0514-4acd-a2ac-24a402060756';

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(returnedCombinedPdf);
  });

  it('should throw an error when the user is not authorized to modify docket entries', async () => {
    await expect(
      appendAmendedPetitionFormInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should use the provided docketEntryId to retrieve the file from s3', async () => {
    await appendAmendedPetitionFormInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0]
        .key,
    ).toEqual(mockDocketEntryId);
  });

  it('should make a call to retrieve the amended petition form from s3', async () => {
    await appendAmendedPetitionFormInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[1][0]
        .key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);
  });

  it('should make a call to combine the order and form documents', async () => {
    await appendAmendedPetitionFormInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0],
    ).toMatchObject({
      firstPdf: testPdfDoc,
      secondPdf: testPdfDoc,
    });
  });

  it('should use the provided docketEntryId to overwrite the order file in s3', async () => {
    await appendAmendedPetitionFormInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().uploadDocument.mock
        .calls[0][0],
    ).toMatchObject({
      pdfData: Buffer.from(returnedCombinedPdf),
      pdfName: mockDocketEntryId,
    });
  });
});
