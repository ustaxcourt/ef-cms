const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePaperServiceAddressPagePdf,
} = require('./generatePaperServiceAddressPagePdf');
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

const mockCurrentUser = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

const mockCase = { docketNumber: '101-19' };

describe('generatePaperServiceAddressPagePdf', () => {
  beforeEach(() => {
    applicationContext.getChromiumBrowser.mockReturnValue(chromiumBrowserMock);
    applicationContext.getCurrentUser.mockReturnValue(mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
    applicationContext.getPug.mockReturnValue({ compile: () => () => '' });
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
      await generatePaperServiceAddressPagePdf({
        applicationContext,
        contactData: {
          name:
            'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
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
      result = await generatePaperServiceAddressPagePdf({
        applicationContext,
        contactData: {
          name:
            'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
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
      await generatePaperServiceAddressPagePdf({
        applicationContext,
        contactData: {
          name:
            'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
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
    const result = await generatePaperServiceAddressPagePdf({
      applicationContext,
      caseEntity: {
        ...MOCK_CASE,
        contactData: {
          name:
            'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
        },
      },
    });

    expect(result).toBeDefined();
  });
});
