const axios = require('axios');

export const userNavigatesToCreateCaseConfirmation = cerebralTest => {
  it('user sees the case confirmation pdf', async () => {
    await cerebralTest.runSequence('gotoPrintableCaseConfirmationSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const pdfPreviewUrl = cerebralTest.getState('pdfPreviewUrl');
    expect(pdfPreviewUrl).not.toBeNull();

    await axios.get(pdfPreviewUrl);
  });
};
