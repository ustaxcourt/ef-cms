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

const chromiumBrowserMock = {
  close: jest.fn(),
  newPage: () => pageMock,
};

const s3Upload = jest.fn().mockImplementation((params, resolve) => resolve());

let applicationContext = {
  getChromiumBrowser: () => chromiumBrowserMock,
  getCurrentUser: () => ({
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  }),
  getDocumentsBucketName: () => 'DocumentBucketName',
  getNodeSass: () => ({ render: (data, cb) => cb(data, { css: '' }) }),
  getPersistenceGateway: () => ({
    getCaseByCaseId: () => ({ docketNumber: '101-19' }),
  }),
  getPug: () => ({ compile: () => () => '' }),
  getStorageClient: () => ({
    upload: s3Upload,
  }),
  logger: { error: jest.fn(), info: () => {} },
};

describe('generateCaseConfirmationPdf', () => {
  beforeEach(() => {
    isAuthorized.mockReturnValue(true);
  });
  afterEach(() => {
    jest.restoreAllMocks();
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

  it('handles exceptions gracefully', async () => {
    jest.spyOn(chromiumBrowserMock, 'newPage').mockImplementation(() => {
      throw new Error('page problem');
    });
    let error;
    try {
      await generateCaseConfirmationPdf({
        applicationContext,
        caseEntity: {
          ...MOCK_CASE,
          documents: [{ servedAt: '2009-09-17T08:06:07.530Z' }],
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(chromiumBrowserMock.close).toHaveBeenCalled();
  });

  it('returns the pdf buffer produced by chromium', async () => {
    await generateCaseConfirmationPdf({
      applicationContext,
      caseEntity: {
        ...MOCK_CASE,
        documents: [{ servedAt: '2009-09-17T08:06:07.530Z' }],
      },
    });

    expect(s3Upload).toHaveBeenCalled();
  });
});
