const assert = require('assert');
const { uploadCasePdfs } = require('./uploadCasePdfs.interactor');

describe('uploadCasesPdfs', () => {
  let applicationContext;

  it('should throw an error if the persistence layer returns the incorrect CaseInitiatorResponse', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadPdfsForNewCase: () => Promise.resolve({}),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await uploadCasePdfs({
        fileHasUploaded: () => {},
        caseInitiator: {
          petitionFile: {},
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });

  it('should throw an error if the caseInitiator passed in is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadPdfsForNewCase: () =>
            Promise.resolve({
              petitionDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await uploadCasePdfs({
        fileHasUploaded: () => {},
        caseInitiator: {},
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });
});
