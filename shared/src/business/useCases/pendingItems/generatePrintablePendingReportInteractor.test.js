const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('generatePrintablePendingReportInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
  });

  it('calls fetch function and return result', async () => {
    applicationContext
      .getUseCaseHelpers()
      .generatePendingReportPdf.mockReturnValue('https://example.com');
    applicationContext
      .getUseCaseHelpers()
      .fetchPendingItems.mockReturnValue([]);

    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(
      applicationContext.getUseCaseHelpers().generatePendingReportPdf,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should generate the title for the report', async () => {
    applicationContext
      .getUseCaseHelpers()
      .generatePendingReportPdf.mockReturnValue('https://example.com');
    applicationContext
      .getUseCaseHelpers()
      .fetchPendingItems.mockReturnValue([]);

    await generatePrintablePendingReportInteractor({
      applicationContext,
      caseId: '123',
    });

    expect(
      applicationContext.getUseCaseHelpers().generatePendingReportPdf.mock
        .calls[0][0],
    ).toMatchObject({
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
