const { generatePendingReportPdf } = require('./generatePendingReportPdf');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');
const PDF_MOCK_BUFFER = 'Hello World';

const pageMock = {
  addStyleTag: () => {},
  pdf: () => {
    return PDF_MOCK_BUFFER;
  },
  setContent: () => {},
};

const browserMock = {
  close: () => {},
  newPage: () => pageMock,
};

const chromiumMock = {
  font: () => {},
  puppeteer: {
    launch: () => browserMock,
  },
};

describe('generatePendingReportPdf', () => {
  it('returns the pdf buffer produced by chromium', async () => {
    const result = await generatePendingReportPdf({
      applicationContext: {
        environment: {
          tempDocumentsBucketName: 'MockDocumentBucketName',
        },
        getChromium: () => chromiumMock,

        getCurrentUser: () => {
          return { role: User.ROLES.petitioner, userId: 'petitioner' };
        },
        getNodeSass: () => ({ render: (data, cb) => cb(data, { css: '' }) }),
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({ docketNumber: '101-19' }),
          getDownloadPolicyUrl: () => ({
            url: 'https://www.example.com',
          }),
        }),
        getPug: () => ({ compile: () => () => '' }),
        getStorageClient: () => ({
          upload: (params, callback) => callback(),
        }),
        logger: { error: () => {}, info: () => {} },
      },
      cases: [MOCK_CASE],
    });

    expect(result).toEqual('https://www.example.com');
  });
});
