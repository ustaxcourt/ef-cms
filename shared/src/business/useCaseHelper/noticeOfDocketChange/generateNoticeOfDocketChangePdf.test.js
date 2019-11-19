const {
  generateNoticeOfDocketChangePdf,
  generatePage,
} = require('./generateNoticeOfDocketChangePdf');
jest.mock('../../../authorization/authorizationClientService');
const {
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { User } = require('../../entities/User');
const PDF_MOCK_BUFFER = 'Hello World';
import { formatDateString } from '../../utilities/DateHandler';
const pug = require('pug');
const sass = require('node-sass');

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

const applicationContext = {
  getCaseCaptionNames: Case.getCaseCaptionNames,
  getChromium: () => chromiumMock,
  getCurrentUser: () => {
    return { role: User.ROLES.petitioner, userId: 'petitioner' };
  },
  getDocumentsBucketName: () => 'DocumentBucketName',
  getNodeSass: () => sass,
  getPersistenceGateway: () => ({
    getCaseByCaseId: () => ({ docketNumber: '101-19' }),
    getDownloadPolicyUrl: () => ({
      url: 'https://www.example.com',
    }),
  }),
  getPug: () => pug,
  getStorageClient: () => ({
    upload: (params, callback) => callback(),
  }),
  getUniqueId: () => 'uniqueId',
  getUtilities: () => ({ formatDateString }),
  logger: { error: () => {}, info: () => {} },
};

const docketChangeInfo = {
  caseTitle: 'This is a Case Title',
  docketEntryIndex: '3',
  docketNumber: '123-19X',
  filingParties: { after: 'Cody', before: 'Joe' },
  filingsAndProceedings: { after: 'Sausage', before: 'Pepperoni' },
};

describe('generatePage', () => {
  it('returns a correctly-generated HTML output based on information provided', async () => {
    const result = await generatePage({ applicationContext, docketChangeInfo });
    expect(result.indexOf('Sausage')).not.toEqual(-1);
    expect(result.indexOf('Cody')).not.toEqual(-1);
    expect(result.indexOf('123-19X')).not.toEqual(-1);
  });
});

describe('generateNoticeOfDocketChangePdf', () => {
  beforeEach(() => {
    isAuthorized.mockReturnValue(true);
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
    const result = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    expect(result).toEqual('https://www.example.com');
  });
});
