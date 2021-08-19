const { applicationContext } = require('../test/createTestApplicationContext');
const { filePetitionInteractor } = require('./filePetitionInteractor');
const { ROLES } = require('../entities/EntityConstants');

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
      filePetitionInteractor(applicationContext, {}),
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
      }),
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
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0].document,
    ).toEqual('this petition file');
  });

  it('calls upload on an ODS file', async () => {
    await filePetitionInteractor(applicationContext, {
      ownershipDisclosureFile: 'this ods file',
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[1][0].document,
    ).toEqual('this ods file');
  });

  it('calls upload on a STIN file', async () => {
    await filePetitionInteractor(applicationContext, {
      stinFile: 'this stin file',
    });

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
    });

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      ownershipDisclosureFileId: undefined,
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Ownership Disclosure Statement file', async () => {
    await filePetitionInteractor(applicationContext, {
      ownershipDisclosureFile: 'something',
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    });

    expect(
      applicationContext.getUseCases().createCaseInteractor.mock.calls[0][1],
    ).toMatchObject({
      ownershipDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
