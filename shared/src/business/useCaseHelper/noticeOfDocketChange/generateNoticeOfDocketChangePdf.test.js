const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfDocketChangePdf,
  generatePage,
} = require('./generateNoticeOfDocketChangePdf');
jest.mock('../../../authorization/authorizationClientService');
const {
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { User } = require('../../entities/User');
const PDF_MOCK_BUFFER = 'Hello World';
const pug = require('pug');
const sass = require('node-sass');

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

const mockPetitionerUser = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

const mockCase = { docketNumber: '101-19' };

const docketChangeInfo = {
  caseTitle: 'This is a Case Title',
  docketEntryIndex: '3',
  docketNumber: '123-19X',
  filingParties: { after: 'Cody', before: 'Joe' },
  filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
};

describe('generatePage', () => {
  beforeEach(() => {
    applicationContext.getChromiumBrowser.mockReturnValue(chromiumBrowserMock);
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext.getNodeSass.mockReturnValue(sass);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'https://www.example.com',
      });
    applicationContext.getPug.mockReturnValue(pug);
    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback(),
    });
  });
  it('returns a correctly-generated HTML output based on information provided', async () => {
    const result = await generatePage({ applicationContext, docketChangeInfo });
    expect(result.indexOf('Sausage')).not.toEqual(-1);
    expect(result.indexOf('Cody')).not.toEqual(-1);
    expect(result.indexOf('123-19X')).not.toEqual(-1);
  });
  it('returns a correctly-generated HTML output based on information provided', async () => {
    const docketChangeArg = {
      ...docketChangeInfo,
      filingsAndProceedings: {
        after: 'Unchanged string',
        before: 'Unchanged string',
      },
    };
    const result = await generatePage({
      applicationContext,
      docketChangeInfo: docketChangeArg,
    });
    expect(result.indexOf('Unchanged string')).toEqual(-1);
  });
});

describe('generateNoticeOfDocketChangePdf', () => {
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
      await generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
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
      result = await generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
      });
    } catch (err) {
      error = err;
    }
    expect(result).not.toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });

  it('returns the pdf buffer produced by chromium', async () => {
    applicationContext.getUniqueId.mockReturnValue('uniqueId');
    applicationContext.getChromiumBrowser.mockReturnValue(chromiumBrowserMock);
    const result = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    expect(result).toEqual('uniqueId');
  });

  it('catches a thrown exception', async () => {
    const chromiumBrowserPdfErrorMock = {
      close: () => {},
      newPage: () => ({
        pdf: () => {
          throw new Error('error pdf');
        },
        setContent: () => {
          throw new Error('error setContent');
        },
      }),
    };
    applicationContext.getChromiumBrowser.mockReturnValue(
      chromiumBrowserPdfErrorMock,
    );

    let err;

    try {
      await generateNoticeOfDocketChangePdf({
        applicationContext,
        docketChangeInfo,
      });
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
  });
});
