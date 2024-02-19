import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { filePetitionFromPaperInteractor } from './filePetitionFromPaperInteractor';

describe('filePetitionFromPaperInteractor', () => {
  let petitionMetadata: string;
  let fileName: string;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor.mockResolvedValue(
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      );

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    petitionMetadata = 'petitionMetaData';
    fileName = 'fileName';
  });

  it('throws an error when a null user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(null);

    await expect(
      filePetitionFromPaperInteractor(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      filePetitionFromPaperInteractor(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('makes a call to create a paper case with a Petition file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
    });
  });

  it('makes a call to create a paper case with a Petition file and a STIN file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
      stinUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('makes a call to create a paper case with a Petition file and a Corporate Disclosure Statement file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      corporateDisclosureUploadProgress: {
        file: fileName,
      },
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
    });
  });

  it('makes a call to create a paper case with a Petition file and an Application for Waiver of Filing Fee file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeUploadProgress: {
        file: fileName,
      },
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFileId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
    });
  });

  it('makes a call to create a paper case with a Petition file and a Request for Place of Trial file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
      requestForPlaceOfTrialUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
      requestForPlaceOfTrialFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('makes a call to create a paper case with a Petition file and an Attachment to Petition file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      atpUploadProgress: {
        file: fileName,
      },
      petitionMetadata,
      petitionUploadProgress: {
        file: fileName,
      },
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(fileName);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      attachmentToPetitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionMetadata,
    });
  });
});
