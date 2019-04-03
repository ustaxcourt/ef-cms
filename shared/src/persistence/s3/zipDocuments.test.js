const { zipDocuments } = require('./zipDocuments');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

xdescribe('proxyquire - a dependency in another module', () => {
  let s3Zip;
  let s3ZipMock;

  let export2 = {
    setArchiverOptions: function() {},
  };

  beforeEach(() => {
    s3ZipMock = sinon.mock(export2);
    s3ZipMock
      .expects('setArchiverOptions')
      .once()
      .returns('This is mocked setArchiverOptions');

    s3Zip = proxyquire('./s3Zip', {
      './export2': export2,
    });
  });

  it('setArchiverOptions function should be called', () => {
    s3Zip.myFunc();
    s3ZipMock.verify();
  });

  afterEach(() => {
    s3ZipMock.restore();
  });
});

/*
proxyquire('stream', {
  PassThrough: () => {},
});

proxyquire('s3-zip', {});

describe('zipDocuments', () => {
  let s3Zip = {
    setArchiverOptions: () => {
      return {
        archive: () => {
          return { pipe: () => {} };
        },
      };
    },
  };

  beforeEach(() => {});
  afterEach(() => {});
  it('creates archives', async () => {
    let zipSpy = {
      getObject: sinon.spy(),
      upload: sinon.spy(),
    };
    const applicationContext = {
      environment: {
        documentsBucketName: 'bar',
        region: 'foo',
      },
      getStorageClient: () => {
        return zipSpy;
      },
    };
    const result = await zipDocuments({
      applicationContext,
      fileNames: ['one.pdf', 'two.pdf'],
      s3Ids: ['s3-id-one', 's3-id-two'],
      zipName: 'test-archive.zip',
    });
    expect(result).toBeTruthy();
    expect(zipSpy.upload).toHaveBeenCalled();
  });
});
*/
