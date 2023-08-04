import { zipS3Files } from './zipS3Files';

describe('zipS3Files', () => {
  it('calls the s3 archive returning a promise', () => {
    const appendSpy = jest.fn();
    const mockFileStream = {
      on(event, cb) {
        if (event === 'data') {
          cb({ data: [], path: 'some-path' });
          cb({ data: [], path: 'some-path/' });
        }
        return this;
      },
      pipe() {},
    };
    zipS3Files({
      additionalFileNames: [],
      additionalFiles: [],
      archiver: () => ({
        append: appendSpy,
        finalize: () => null,
        on: () => null,
      }),
      bucket: 'some-bucket',
      onEntry: () => {},
      onError: () => {},
      onProgress: () => {},
      s3Client: null,
      s3FilesLib: {
        connect: () => ({
          createKeyStream: () => null,
        }),
        createFileStream: () => mockFileStream,
      },
      s3Keys: ['test/test.txt'],
      s3KeysFileNames: [],
    });
    expect(appendSpy).toHaveBeenCalledWith('', { name: 'some-path' });
    expect(appendSpy).toHaveBeenCalledTimes(1);
  });
});
