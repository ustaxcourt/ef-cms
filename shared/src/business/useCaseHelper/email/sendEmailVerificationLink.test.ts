const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { sendEmailVerificationLink } = require('./sendEmailVerificationLink');

describe('sendEmailVerificationLink', () => {
  it('should call applicationContext.getDispatchers().sendBulkTemplatedEmail with the provided pendingEmail and templateData', () => {
    const mockPendingEmail = 'test@example.com';
    const mockEmailVerificationToken = 'abc123';

    sendEmailVerificationLink({
      applicationContext,
      pendingEmail: mockPendingEmail,
      pendingEmailVerificationToken: mockEmailVerificationToken,
    });

    const { email, templateData } =
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations[0];

    expect(email).toEqual(mockPendingEmail);
    expect(templateData.emailContent).toContain(mockEmailVerificationToken);
  });
});
