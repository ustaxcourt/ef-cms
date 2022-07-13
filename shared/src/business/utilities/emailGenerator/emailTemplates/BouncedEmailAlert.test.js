const React = require('react');
const { BouncedEmailAlert } = require('./BouncedEmailAlert.jsx');
const { render } = require('@testing-library/react');

describe('BouncedEmailAlert', () => {
  const bounceDetail = {
    bounceRecipient: 'someone@example.com',
    bounceSubType: 'Permanent',
    bounceType: 'OnSuppressionList',
    currentDate: '2022-01-01',
    environmentName: 'local',
    errorMessage: 'Message Undeliverable',
    subject: 'We are attempting to serve you',
  };

  it('renders bounce information', () => {
    const { getByTestId } = render(
      <BouncedEmailAlert
        bounceRecipient={bounceDetail.bounceRecipient}
        bounceSubType={bounceDetail.bounceSubType}
        bounceType={bounceDetail.bounceType}
        currentDate={bounceDetail.currentDate}
        environmentName={bounceDetail.environmentName}
        errorMessage={bounceDetail.errorMessage}
        subject={bounceDetail.subject}
      />,
    );

    expect(getByTestId('environment').textContent).toBe(
      `Environment Name: ${bounceDetail.environmentName}`,
    );
    expect(getByTestId('bounce-type').textContent).toBe(
      `Bounce Type: ${bounceDetail.bounceType}`,
    );
    expect(getByTestId('bounce-subtype').textContent).toBe(
      `Bounce Sub Type: ${bounceDetail.bounceSubType}`,
    );
    expect(getByTestId('email-recipient').textContent).toBe(
      `Email Recipient(s): ${bounceDetail.bounceRecipient}`,
    );
    expect(getByTestId('error-message').textContent).toBe(
      `Error Message: ${bounceDetail.errorMessage}`,
    );
    expect(getByTestId('email-subject').textContent).toBe(
      `Email Subject: ${bounceDetail.subject}`,
    );
  });
});
