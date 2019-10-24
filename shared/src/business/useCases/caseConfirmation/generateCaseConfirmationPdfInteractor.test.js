const {
  generateCaseConfirmationPdfInteractor,
} = require('./generateCaseConfirmationPdfInteractor');
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

describe('generateCaseConfirmationPdfInteractor', () => {
  it('returns the pdf buffer produced by chromium', async () => {
    const result = await generateCaseConfirmationPdfInteractor({
      applicationContext: {
        environment: {
          documentsBucketName: 'something',
        },
        getChromium: () => chromiumMock,
        getCurrentUser: () => {
          return { role: User.ROLES.petitioner, userId: 'petitioner' };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: () => ({ docketNumber: '101-19' }),
          getDownloadPolicyUrl: () => ({
            url: 'https://www.example.com',
          }),
        }),
        getStorageClient: () => ({
          upload: (params, callback) => callback(),
        }),
        logger: { error: () => {}, info: () => {} },
      },
      htmlString: 'Hello World from the use case',
    });

    expect(result).toEqual('https://www.example.com');
  });
});
