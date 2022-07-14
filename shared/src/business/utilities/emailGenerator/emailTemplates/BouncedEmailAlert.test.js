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
    const { queryByText } = render(
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
    expect(
      queryByText(bounceDetail.bounceRecipient, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.bounceSubType, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.bounceType, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.currentDate, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.environmentName, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.errorMessage, { exact: false }),
    ).toBeInTheDocument();
    expect(
      queryByText(bounceDetail.subject, { exact: false }),
    ).toBeInTheDocument();
  });
});
