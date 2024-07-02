import { AMENDED_PETITION_FORM_NAME } from '../../../../../shared/src/business/entities/EntityConstants';
import { appendAmendedPetitionFormInteractor } from './appendAmendedPetitionFormInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

const mockDocketEntryId = 'd594360c-0514-4acd-a2ac-24a402060756';

describe('appendAmendedPetitionFormInteractor', () => {
  const fakeFile1 = 'docket tre';
  const fakeFile2 = 'snoop docket';
  const returnedCombinedPdf = 'ever';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(fakeFile1);

    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(returnedCombinedPdf);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: fakeFile2,
      }),
    });
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

  it('should throw an error when there is no file in s3 that corresponds to the docketEntryId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValueOnce('Not Found');

    await expect(
      appendAmendedPetitionFormInteractor(
        applicationContext,
        {
          docketEntryId: mockDocketEntryId,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(`Docket entry ${mockDocketEntryId} was not found`);
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
      applicationContext.getStorageClient().getObject.mock.calls[0][0].Key,
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
      firstPdf: fakeFile1,
      secondPdf: fakeFile2,
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
      applicationContext.getUtilities().uploadToS3.mock.calls[0][0],
    ).toMatchObject({
      pdfData: Buffer.from(returnedCombinedPdf),
      pdfName: mockDocketEntryId,
    });
  });
});
