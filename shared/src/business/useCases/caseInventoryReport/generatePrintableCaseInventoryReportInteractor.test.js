const {
  generatePrintableCaseInventoryReportInteractor,
} = require('./generatePrintableCaseInventoryReportInteractor');
const { User } = require('../../entities/User');

describe('generatePrintableCaseInventoryReportInteractor', () => {
  let generateCaseInventoryReportPdfSpy;
  let getCaseInventoryReportSpy;
  let applicationContext;
  let user;

  beforeEach(() => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getUseCaseHelpers: () => ({
        generateCaseInventoryReportPdf: generateCaseInventoryReportPdfSpy,
        getCaseInventoryReport: getCaseInventoryReportSpy,
      }),
    };
  });

  it('calls generateCaseInventoryReportPdf function and returns result', async () => {
    generateCaseInventoryReportPdfSpy = jest.fn(() => 'https://example.com');
    getCaseInventoryReportSpy = jest.fn(() => []);

    const results = await generatePrintableCaseInventoryReportInteractor({
      applicationContext,
      associatedJudge: 'Judge Armen',
    });

    expect(generateCaseInventoryReportPdfSpy).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      generatePrintableCaseInventoryReportInteractor({
        applicationContext,
        associatedJudge: 'Judge Armen',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if associatedJudge and status are not passed in', async () => {
    await expect(
      generatePrintableCaseInventoryReportInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Either judge or status must be provided');
  });
});
