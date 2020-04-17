const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateCaseInventoryReportPdf,
} = require('./generateCaseInventoryReportPdf');
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

const mockCases = [
  {
    associatedJudge: 'Chief Judge',
    docketNumber: '101-19',
    status: 'New',
  },
  {
    associatedJudge: 'Chief Judge',
    docketNumber: '101-20',
    status: 'New',
  },
];

describe('generateCaseInventoryReportPdf', () => {
  let user;
  let generatePdfReportInteractorMock;
  let generatedHtml;

  beforeEach(() => {
    user = { role: User.ROLES.petitionsClerk, userId: 'petitionsClerk' };

    generatedHtml = '';
    generatePdfReportInteractorMock = jest.fn(({ contentHtml }) => {
      generatedHtml = contentHtml;
    });

    applicationContext.getCurrentUser.mockReturnValue(user);
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      docketNumber: '101-19',
    });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'https://www.example.com',
      });
    applicationContext.getPug.mockReturnValue({
      compile: () => ({ showJudgeColumn, showStatusColumn }) => {
        const judgeColumn = showJudgeColumn ? '<th>Judge</th>' : '';
        const statusColumn = showStatusColumn ? '<th>Case Status</th>' : '';
        return `${judgeColumn} ${statusColumn}`;
      },
    });
    applicationContext.getChromiumBrowser.mockReturnValue(chromiumBrowserMock);

    applicationContext.getStorageClient.mockReturnValue({
      upload: (params, callback) => callback(),
    });
    applicationContext.getUseCases.mockReturnValue({
      generatePdfReportInteractor: generatePdfReportInteractorMock,
    });
  });

  it('throws an error if the user is unauthorized', async () => {
    user = { role: User.ROLES.petitioner, userId: 'petitioner' };

    applicationContext.getCurrentUser.mockReturnValue(user);
    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
        cases: mockCases,
        filters: { associatedJudge: 'Chief Judge' },
      }),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('calls the pdf report generator', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: 'Chief Judge' },
    });

    expect(generatePdfReportInteractorMock).toHaveBeenCalled();
  });

  it('returns the pdf buffer produced by the generator', async () => {
    const result = await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: 'Chief Judge' },
    });

    expect(result).toEqual('https://www.example.com');
  });

  it('should catch, log, and rethrow an error thrown by the generator', async () => {
    generatePdfReportInteractorMock = jest
      .fn()
      .mockRejectedValue(new Error('bad!'));

    applicationContext.getUseCases.mockReturnValue({
      generatePdfReportInteractor: generatePdfReportInteractorMock,
    });

    await expect(
      generateCaseInventoryReportPdf({
        applicationContext,
        cases: mockCases,
        filters: { associatedJudge: 'Chief Judge' },
      }),
    ).rejects.toThrow('bad!');
  });

  it('should hide the status column if the status filter is set', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { status: 'New' },
    });

    expect(generatedHtml.includes('<th>Judge</th>')).toBeTruthy();
    expect(generatedHtml.includes('<th>Case Status</th>')).toBeFalsy();
  });

  it('should hide the judge column if the judge filter is set', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: 'Chief Judge' },
    });

    expect(generatedHtml.includes('<th>Case Status</th>')).toBeTruthy();
    expect(generatedHtml.includes('<th>Judge</th>')).toBeFalsy();
  });

  it('should hide the judge and status columns if the associatedJudge and status filters are set', async () => {
    await generateCaseInventoryReportPdf({
      applicationContext,
      cases: mockCases,
      filters: { associatedJudge: 'Chief Judge', status: 'New' },
    });

    expect(generatedHtml.includes('<th>Judge</th>')).toBeFalsy();
    expect(generatedHtml.includes('<th>Case Status</th>')).toBeFalsy();
  });
});
