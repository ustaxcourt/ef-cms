const {
  uploadPdf,
  uploadDocument,
  getDocument,
  uploadPdfsForNewCase,
} = require('./awsS3Persistence');
const sinon = require('sinon');

describe('uploadPdf', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    let postSpy = sinon.spy();
    const applicationContext = {
      getHttpClient: () => ({
        post: postSpy,
      }),
      getUniqueId: () => '123',
    };
    await uploadPdf({
      policy: {
        fields: {
          'X-Amz-Algorithm': '1',
          'X-Amz-Credential': '2',
          'X-Amz-Date': '3',
          'X-Amz-Security-Token': '4',
          Policy: 'gg',
          'X-Amz-Signature': '5',
        },
        url: 'http://test.com',
      },
      file: new File([], 'abc'),
      applicationContext,
    });
    expect(postSpy.getCall(0).args[0]).toEqual('http://test.com');
    expect([...postSpy.getCall(0).args[1].entries()]).toMatchObject([
      ['key', '123'],
      ['X-Amz-Algorithm', '1'],
      ['X-Amz-Credential', '2'],
      ['X-Amz-Date', '3'],
      ['X-Amz-Security-Token', '4'],
      ['Policy', 'gg'],
      ['X-Amz-Signature', '5'],
      ['Content-Type', 'application/pdf'],
      ['file', {}],
    ]);
    expect(postSpy.getCall(0).args[2]).toEqual({
      headers: { 'content-type': 'multipart/form-data; boundary=undefined' },
    });
  });
});

describe('uploadDocument', () => {
  it('returns the expected documentId after when the upload was successful', async () => {
    const DOCUMENT_ID = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getHttpClient: () => ({
        get: () => ({
          data: 'url',
        }),
      }),
      getPersistenceGateway: () => ({
        uploadPdf: () => DOCUMENT_ID,
      }),
    };
    const documentId = await uploadDocument({
      applicationContext,
    });
    expect(documentId).toEqual(DOCUMENT_ID);
  });
});

describe('getDocument', () => {
  it('returns the expected documentId after when the upload was successful', async () => {
    const BLOB_DATA = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getHttpClient: () => {
        const fun = () => ({
          data: BLOB_DATA,
        });
        fun.get = () => ({
          data: 'http://localhost',
        });
        return fun;
      },
      getPersistenceGateway: () => ({
        uploadPdf: () => BLOB_DATA,
      }),
    };
    const result = await getDocument({
      applicationContext,
    });
    expect(result).toEqual(new Blob([BLOB_DATA], { type: 'application/pdf' }));
  });
});

describe('uploadPdfsForNewCase', () => {
  it('should return the two ids associated with the uploaded documents', async () => {
    const fileHasUploadedSpy = sinon.spy();
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getHttpClient: () => {
        const fun = () => ({
          data: 'gg',
        });
        fun.get = () => ({
          data: {
            fields: {
              'X-Amz-Algorithm': '1',
              'X-Amz-Credential': '2',
              'X-Amz-Date': '3',
              'X-Amz-Security-Token': '4',
              Policy: 'gg',
              'X-Amz-Signature': '5',
            },
            url: 'http://test.com',
          },
        });
        fun.post = () => null;
        return fun;
      },
      getUniqueId: () => '123',
      getPersistenceGateway: () => ({
        uploadPdf: () => 'abc',
      }),
    };
    const result = await uploadPdfsForNewCase({
      applicationContext,
      caseInitiator: {
        petitionFile: new File([], '1'),
        irsNoticeFile: new File([], '2'),
      },
      fileHasUploaded: fileHasUploadedSpy,
    });
    expect(fileHasUploadedSpy.getCalls().length).toEqual(2);
    expect(result).toEqual({
      irsNoticeFileId: '123',
      petitionDocumentId: '123',
    });
  });
});
