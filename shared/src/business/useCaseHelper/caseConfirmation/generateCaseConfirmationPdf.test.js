const {
  generateCaseConfirmationPdf,
} = require('./generateCaseConfirmationPdf');
jest.mock('../../../authorization/authorizationClientService');
const {
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
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

let applicationContext = {
  getChromium: () => chromiumMock,
  getCurrentUser: () => ({
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  }),
  getDocumentsBucketName: () => 'DocumentBucketName',
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
};

describe('generateCaseConfirmationPdf', () => {
  beforeEach(() => {
    isAuthorized.mockReturnValue(true);
  });

  it('requires permissions', async () => {
    isAuthorized.mockReturnValue(false);
    let result, error;
    try {
      result = await generateCaseConfirmationPdf({
        applicationContext,
        caseEntity: {
          ...MOCK_CASE,
          documents: [{ servedAt: '2009-09-17T08:06:07.530Z' }],
        },
      });
    } catch (err) {
      error = err;
    }
    expect(result).not.toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });

  it('returns the pdf buffer produced by chromium', async () => {
    const result = await generateCaseConfirmationPdf({
      applicationContext,
      caseEntity: {
        ...MOCK_CASE,
        documents: [{ servedAt: '2009-09-17T08:06:07.530Z' }],
      },
    });

    expect(result).toEqual('https://www.example.com');
  });
});
