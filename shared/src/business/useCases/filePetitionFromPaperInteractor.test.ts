import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { filePetitionFromPaperInteractor } from './filePetitionFromPaperInteractor';

beforeAll(() => {
  applicationContext
    .getUseCases()
    .uploadDocumentAndMakeSafeInteractor.mockResolvedValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
});

describe('filePetitionFromPaperInteractor', () => {
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

  it('calls upload on a Petition file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: 'this petition file',
      petitionMetadata: null,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual('this petition file');
  });

  it('calls upload on an Application for Waiver of Filing Fee file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFile: 'this APW file',
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual('this APW file');
  });

  it('calls upload on an CDS file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      corporateDisclosureFile: 'this cds file',
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual('this cds file');
  });

  it('calls upload on a STIN file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      stinFile: 'this stin file',
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual('this stin file');
  });

  it('calls upload on a Request for Place of Trial file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      requestForPlaceOfTrialFile: 'this rqt file',
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual('this rqt file');
  });

  it('uploads a Petition file and a STIN file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: undefined,
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Corporate Disclosure Statement file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      corporateDisclosureFile: 'something',
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Application for Waiver of Filing Fee file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFile: 'something',
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFileId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads a Request for Place of Trial file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      requestForPlaceOfTrialFile: 'something',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      requestForPlaceOfTrialFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
