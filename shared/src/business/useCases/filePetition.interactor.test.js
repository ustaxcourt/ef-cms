const { filePetition } = require('./filePetition.interactor');
const sinon = require('sinon');

describe('filePetition', () => {
  let applicationContext;

  function createApplicationContext(options) {
    return {
      getCurrentUser: () => ({
        userId: 'respondent',
      }),
      getPersistenceGateway: () => ({
        uploadDocument: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
      getUseCases: () => ({
        createCase: () => null,
      }),
      environment: { stage: 'local' },
      ...options,
    };
  }

  let fileHasUploadedStub;

  beforeEach(() => {
    fileHasUploadedStub = sinon.stub();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    let error;
    try {
      await filePetition({
        petitionMetadata: null,
        petitionFile: null,
        fileHasUploaded: fileHasUploadedStub,
        applicationContext: createApplicationContext(),
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    await filePetition({
      petitionMetadata: null,
      petitionFile: null,
      fileHasUploaded: fileHasUploadedStub,
      applicationContext: createApplicationContext({
        getCurrentUser: () => ({
          userId: 'taxpayer',
        }),
      }),
    });
    expect(fileHasUploadedStub.called).toBeTruthy();
  });
});
