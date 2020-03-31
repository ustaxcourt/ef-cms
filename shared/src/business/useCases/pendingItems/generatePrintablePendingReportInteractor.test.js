const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('generatePrintablePendingReportInteractor', () => {
  let generatePendingReportPdfSpy;
  let fetchPendingItemsSpy;
  let getCaseByCaseIdSpy;

  beforeEach(() => {
    generatePendingReportPdfSpy = jest.fn();
    fetchPendingItemsSpy = jest.fn();
    getCaseByCaseIdSpy = jest.fn(() => MOCK_CASE);

    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(getCaseByCaseIdSpy);
    applicationContext
      .getUseCaseHelpers()
      .fetchPendingItems.mockImplementation(fetchPendingItemsSpy);
    applicationContext
      .getUseCaseHelpers()
      .generatePendingReportPdf.mockImplementation(generatePendingReportPdfSpy);
  });

  it('calls fetch function and return result', async () => {
    generatePendingReportPdfSpy.mockReturnValue('https://example.com');
    fetchPendingItemsSpy.mockReturnValue([]);

    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(generatePendingReportPdfSpy).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should generate the title for the report', async () => {
    generatePendingReportPdfSpy.mockReturnValue('https://example.com');
    fetchPendingItemsSpy.mockReturnValue([]);

    await generatePrintablePendingReportInteractor({
      applicationContext,
      caseId: '123',
    });

    expect(generatePendingReportPdfSpy.mock.calls[0][0]).toMatchObject({
      reportTitle: 'Pending Report for Docket 101-18',
    });
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    let error;
    try {
      await generatePrintablePendingReportInteractor({
        applicationContext,
        judge: 'Judge Armen',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
