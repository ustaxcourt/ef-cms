const {
  generatePrintablePendingReportInteractor,
} = require('./generatePrintablePendingReportInteractor');
const { User } = require('../../entities/User');

describe('generatePrintablePendingReportInteractor', () => {
  let generatePendingReportPdfSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return {
        role: User.ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    },
    getUseCaseHelpers: () => ({
      generatePendingReportPdf: generatePendingReportPdfSpy,
    }),
  };

  it('calls fetch function and return result', async () => {
    generatePendingReportPdfSpy = jest.fn(() => 'https://some.url');

    const results = await generatePrintablePendingReportInteractor({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(generatePendingReportPdfSpy).toHaveBeenCalled();
    expect(results).toEqual('https://some.url');
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
