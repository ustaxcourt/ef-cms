const fs = require('fs');
const path = require('path');
const { virusScanPdfInteractor } = require('./virusScanPdfInteractor');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testAsset = filename => {
  return fs.readFileSync(testAssetsPath + filename);
};

describe('virusScanPdfInteractor', () => {
  it('detects a clean PDF', async () => {
    const cleanParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: jest.fn().mockReturnValue({
            promise: async () => ({
              Body: testAsset('sample.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          error: () => null,
        },
        runVirusScan: async () => true,
      },
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };
    const result = await virusScanPdfInteractor(cleanParams);
    expect(result).toBe('clean');
  });

  it('detects an infected PDF', async () => {
    const infectedParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: jest.fn().mockReturnValue({
            promise: async () => ({
              Body: testAsset('fake-virus.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          error: () => null,
        },
        runVirusScan: async () => {
          throw new Error('');
        },
      },
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    let error;
    try {
      await virusScanPdfInteractor(infectedParams);
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('error scanning PDF');
  });

  it('detects an infected PDF with code 1', async () => {
    const infectedParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: jest.fn().mockReturnValue({
            promise: async () => ({
              Body: testAsset('fake-virus.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          error: () => null,
        },
        runVirusScan: async () => {
          const err = new Error('');
          err.code = 1;
          throw err;
        },
      },
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    let error;
    try {
      await virusScanPdfInteractor(infectedParams);
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('infected');
  });
});
