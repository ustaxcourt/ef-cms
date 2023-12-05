import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { uploadPdfFromClient } from './uploadPdfFromClient';

describe('uploadPdfFromClient', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    applicationContext.getHttpClient().post.mockResolvedValue(null);

    await uploadPdfFromClient({
      applicationContext,
      file: new File([], 'abc'),
      key: '123',
      onUploadProgress: () => null,
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

    expect(applicationContext.getHttpClient().post.mock.calls[0][0]).toEqual(
      'http://test.com',
    );
    expect([
      ...applicationContext.getHttpClient().post.mock.calls[0][1].entries(),
    ]).toMatchObject([
      ['key', '123'],
      ['X-Amz-Algorithm', '1'],
      ['X-Amz-Credential', '2'],
      ['X-Amz-Date', '3'],
      ['X-Amz-Security-Token', '4'],
      ['Policy', 'gg'],
      ['X-Amz-Signature', '5'],
      ['content-type', 'application/pdf'],
      ['file', {}],
    ]);
    expect(
      applicationContext.getHttpClient().post.mock.calls[0][2],
    ).toMatchObject({
      headers: { 'content-type': 'multipart/form-data; boundary=undefined' },
    });
  });

  it('makes use of defaults when not provided', async () => {
    await uploadPdfFromClient({
      applicationContext,
      file: new Blob([]),
      key: '123',
      onUploadProgress: () => null,
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

    expect([
      ...applicationContext.getHttpClient().post.mock.calls[0][1].entries(),
    ]).toMatchObject([
      ['key', '123'],
      ['X-Amz-Algorithm', '1'],
      ['X-Amz-Credential', '2'],
      ['X-Amz-Date', '3'],
      ['X-Amz-Security-Token', ''],
      ['Policy', 'gg'],
      ['X-Amz-Signature', '5'],
      ['content-type', 'application/pdf'],
      ['file', {}],
    ]);
    expect(
      applicationContext.getHttpClient().post.mock.calls[0][2],
    ).toMatchObject({
      headers: { 'content-type': 'multipart/form-data; boundary=undefined' },
    });
  });
});
