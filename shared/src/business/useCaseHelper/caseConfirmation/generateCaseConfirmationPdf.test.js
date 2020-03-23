const {
  generateCaseConfirmationPdf,
} = require('./generateCaseConfirmationPdf');
jest.mock('../../../authorization/authorizationClientService');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
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

const mockCurrentUser = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

const s3Upload = jest.fn().mockImplementation((params, resolve) => resolve());

applicationContext.getCurrentUser.mockReturnValue(mockCurrentUser);
applicationContext.getDocumentsBucketName.mockReturnValue('DocumentBucketName');
applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
  docketNumber: '101-19',
});
applicationContext.getPug.mockReturnValue({
  compile: () => () => '',
});
applicationContext.getStorageClient.mockReturnValue({
  upload: s3Upload,
});

describe('generateCaseConfirmationPdf', () => {
  beforeEach(() => {
    isAuthorized.mockReturnValue(true);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fails to get chromium browser', async () => {
    jest
      .spyOn(applicationContext, 'getChromiumBrowser')
      .mockImplementation(() => {
        return null;
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
    expect(chromiumBrowserMock.close).not.toHaveBeenCalled();
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
    applicationContext.getChromiumBrowser.mockReturnValue(chromiumBrowserMock);
    let error;
    try {
      await generateCaseConfirmationPdf({
        applicationContext,
        caseEntity: {
          ...MOCK_CASE,
          contactPrimary: {
            countryType: 'domestic',
          },
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
        contactPrimary: {
          country: 'Canada',
          countryType: 'international',
        },
        documents: [{ servedAt: '2009-09-17T08:06:07.530Z' }],
        getCaseConfirmationGeneratedPdfFileName() {
          return '';
        },
      },
    });

    expect(applicationContext.getStorageClient).toHaveBeenCalled();
  });
});
