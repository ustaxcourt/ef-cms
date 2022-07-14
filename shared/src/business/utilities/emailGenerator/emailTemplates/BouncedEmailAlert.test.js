const React = require('react');
const { BouncedEmailAlert } = require('./BouncedEmailAlert.jsx');
const { render } = require('@testing-library/react');
const { toBeInTheDocument } = require('@testing-library/jest-dom');

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
    expect(queryByText(/someone@example.com/i)).toBeInTheDocument();
    expect(queryByText(/Permanent/i)).toBeInTheDocument();
    expect(queryByText(/OnSuppressionList/i)).toBeInTheDocument();
    expect(queryByText(/2022-01-01/i)).toBeInTheDocument();
    expect(queryByText(/local/i)).toBeInTheDocument();
    expect(queryByText(/Message Undeliverable/i)).toBeInTheDocument();
    expect(queryByText(/We are attempting to serve you/i)).toBeInTheDocument();
  });
});
