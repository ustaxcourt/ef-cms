import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { filePetitionInteractor } from './filePetitionInteractor';

describe('filePetitionInteractor', () => {
  let stinFile: string;
  let petitionFile: string;
  let corporateDisclosureFile: string;
  let petitionMetadata: string;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient.mockResolvedValue(
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      );
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    stinFile = 'this is a stin file';
    petitionFile = 'this is a petition file';
    corporateDisclosureFile = 'this is a cds file';
  });
  it('throws an error when a null user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(null);

    await expect(
      filePetitionInteractor(applicationContext, {} as any),
    ).rejects.toThrow();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      filePetitionInteractor(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('calls upload on a Petition file', async () => {
    await filePetitionInteractor(applicationContext, {
      petitionFile,
      petitionMetadata: null,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual('this is a petition file');
  });

  it('calls upload on an CDS file', async () => {
    await filePetitionInteractor(applicationContext, {
      corporateDisclosureFile,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this is a cds file');
  });

  it('calls upload on a STIN file', async () => {
    await filePetitionInteractor(applicationContext, {
      stinFile,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this is a stin file');
  });

  it('uploads a Petition file and a STIN file', async () => {
    await filePetitionInteractor(applicationContext, {
      petitionFile,
      petitionMetadata,
      stinFile,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual('this is a petition file');

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this is a stin file');

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: undefined,
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Corporate Disclosure Statement file', async () => {
    await filePetitionInteractor(applicationContext, {
      corporateDisclosureFile,
      petitionFile,
      petitionMetadata,
      stinFile,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this is a cds file');

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads multiple "Attachment to Petition" files', async () => {
    await filePetitionInteractor(applicationContext, {
      atpFilesMetadata: ['atpFile1', 'atpFile2'],
      petitionFile,
      petitionMetadata,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient,
    ).toHaveBeenCalledTimes(3);

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      atpFileIds: [
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      ],
      corporateDisclosureFileId: undefined,
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: undefined,
    });
  });
});
