const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('generatePrintablePendingReportInteractor', () => {
  let generatePendingReportPdfSpy;
  let fetchPendingItemsSpy;
  let getCaseByCaseIdSpy = jest.fn(() => MOCK_CASE);

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return {
        role: User.ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    },
    getPersistenceGateway: () => ({ getCaseByCaseId: getCaseByCaseIdSpy }),
    getUseCaseHelpers: () => ({
      fetchPendingItems: fetchPendingItemsSpy,
      generatePendingReportPdf: generatePendingReportPdfSpy,
    }),
  };

  it('calls fetch function and return result', async () => {
    generatePendingReportPdfSpy = jest.fn(() => 'https://example.com');
    fetchPendingItemsSpy = jest.fn(() => []);

    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(generatePendingReportPdfSpy).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should generate the title for the report', async () => {
    generatePendingReportPdfSpy = jest.fn(() => 'https://example.com');
    fetchPendingItemsSpy = jest.fn(() => []);

    await generatePrintablePendingReportInteractor({
      applicationContext,
      caseId: '123',
    });

    expect(generatePendingReportPdfSpy.mock.calls[0][0]).toMatchObject({
      reportTitle: 'Pending Report for Docket 101-18',
    });
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    applicationContext.getCurrentUser = () => {
      return {
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      };
    };

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
