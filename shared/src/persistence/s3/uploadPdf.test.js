const sinon = require('sinon');
const { uploadPdf } = require('./uploadPdf');

describe('uploadPdf', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    let postSpy = sinon.spy();
    const applicationContext = {
      getCurrentUser: () => {
        return { role: 'petitioner', userId: 'taxpayer' };
      },
      getCurrentUserToken: () => {
        return '';
      },
      getHttpClient: () => ({
        post: postSpy,
      }),
      getUniqueId: () => '123',
    };
    await uploadPdf({
      applicationContext,
      file: new File([], 'abc'),
      policy: {
        fields: {
          Policy: 'gg',
          'X-Amz-Algorithm': '1',
          'X-Amz-Credential': '2',
          'X-Amz-Date': '3',
          'X-Amz-Security-Token': '4',
          'X-Amz-Signature': '5',
        },
        url: 'http://test.com',
      },
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
  it('makes use of defaults when not provided', async () => {
    let postSpy = sinon.spy();
    const applicationContext = {
      getCurrentUser: () => {
        return { role: 'petitioner', userId: 'taxpayer' };
      },
      getCurrentUserToken: () => {
        return '';
      },
      getHttpClient: () => ({
        post: postSpy,
      }),
      getUniqueId: () => '123',
    };
    await uploadPdf({
      applicationContext,
      file: new Blob([]),
      policy: {
        fields: {
          Policy: 'gg',
          'X-Amz-Algorithm': '1',
          'X-Amz-Credential': '2',
          'X-Amz-Date': '3',
          'X-Amz-Signature': '5',
        },
        url: 'http://test.com',
      },
    });
    expect([...postSpy.getCall(0).args[1].entries()]).toMatchObject([
      ['key', '123'],
      ['X-Amz-Algorithm', '1'],
      ['X-Amz-Credential', '2'],
      ['X-Amz-Date', '3'],
      ['X-Amz-Security-Token', ''],
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
