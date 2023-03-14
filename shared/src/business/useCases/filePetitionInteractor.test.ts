import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { filePetitionInteractor } from './filePetitionInteractor';

beforeAll(() => {
  applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient.mockResolvedValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
});

describe('filePetitionInteractor', () => {
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await filePetitionInteractor(applicationContext, {
      petitionFile: 'this petition file',
      petitionMetadata: null,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual('this petition file');
  });

  it('calls upload on an CDS file', async () => {
    await filePetitionInteractor(applicationContext, {
      corporateDisclosureFile: 'this cds file',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this cds file');
  });

  it('calls upload on a STIN file', async () => {
    await filePetitionInteractor(applicationContext, {
      stinFile: 'this stin file',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this stin file');
  });

  it('uploads a Petition file and a STIN file', async () => {
    await filePetitionInteractor(applicationContext, {
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

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
      corporateDisclosureFile: 'something',
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
