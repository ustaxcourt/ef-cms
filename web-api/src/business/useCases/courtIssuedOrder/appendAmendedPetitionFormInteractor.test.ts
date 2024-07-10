import {
  AMENDED_PETITION_FORM_NAME,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { appendAmendedPetitionFormInteractor } from './appendAmendedPetitionFormInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { testPdfDoc } from '@shared/business/test/getFakeFile';

describe('appendAmendedPetitionFormInteractor', () => {
  const returnedCombinedPdf = 'ever';
  const mockDocketEntryId = 'd594360c-0514-4acd-a2ac-24a402060756';

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '432',
    });

    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(returnedCombinedPdf);
  });

  it('should throw an error when the user is not authorized to modify docket entries', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '432',
    });

    await expect(
      appendAmendedPetitionFormInteractor(applicationContext, {} as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should use the provided docketEntryId to retrieve the file from s3', async () => {
    await appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0]
        .key,
    ).toEqual(mockDocketEntryId);
  });

  it('should make a call to retrieve the amended petition form from s3', async () => {
    await appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[1][0]
        .key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);
  });

  it('should make a call to combine the order and form documents', async () => {
    await appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0],
    ).toMatchObject({
      firstPdf: testPdfDoc,
      secondPdf: testPdfDoc,
    });
  });

  it('should use the provided docketEntryId to overwrite the order file in s3', async () => {
    await appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocument.mock
        .calls[0][0],
    ).toMatchObject({
      pdfData: Buffer.from(returnedCombinedPdf),
      pdfName: mockDocketEntryId,
    });
  });
});
