const {
  AMENDED_PETITION_FORM_NAME,
} = require('../../entities/EntityConstants');
const {
  appendAmendedPetitionFormInteractor,
} = require('./appendAmendedPetitionFormInteractor');
const {
  applicationContext,
  getFakeFile,
} = require('../../test/createTestApplicationContext');
const { ROLES } = require('../../entities/EntityConstants');

const mockDocketEntryId = 'd594360c-0514-4acd-a2ac-24a402060756';

describe('appendAmendedPetitionFormInteractor', () => {
  const fakeFile1 = 'docket tre';
  const fakeFile2 = 'snoop docket';
  const returnedCombinedPdf = {
    lastName: 'ever',
  };
  applicationContext
    .getUtilities()
    .combineTwoPdfs.mockReturnValue(returnedCombinedPdf);
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '432',
    });

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(fakeFile1);
  });

  it('should throw an error when the user is not authorized to modify docket entries', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '432',
    });

    await expect(
      appendAmendedPetitionFormInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when there is no file in s3 that corresponds to the docketEntryId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValueOnce('Not Found');

    await expect(
      appendAmendedPetitionFormInteractor(applicationContext, {
        docketEntryId: mockDocketEntryId,
      }),
    ).rejects.toThrow(`Docket entry ${mockDocketEntryId} was not found`);
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
      applicationContext.getStorageClient().getObject.mock.calls[0][0].Key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);
  });

  it('should return the combined order and form documents as a pdf', async () => {
    const result = await appendAmendedPetitionFormInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
      },
    );

    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0],
    ).toMatchObject({
      firstPdf: fakeFile1,
      secondPdf: fakeFile2,
    });
    expect(result).toEqual(returnedCombinedPdf);
  });
});
