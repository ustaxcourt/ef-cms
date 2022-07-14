const React = require('react');
const { BouncedEmailAlert } = require('./BouncedEmailAlert.jsx');
const { queryByAttribute, render, within } = require('@testing-library/react');

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

  const getById = queryByAttribute.bind(null, 'id');

  it('renders bounce information', () => {
    const { container } = render(
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

    const alertInfo = getById(container, 'diagnostic-information');

    expect(
      within(alertInfo).getByText(bounceDetail.bounceRecipient, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(alertInfo).getByText(bounceDetail.bounceSubType, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(alertInfo).getByText(bounceDetail.bounceType, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(alertInfo).getByText(bounceDetail.environmentName, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(alertInfo).getByText(bounceDetail.errorMessage, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(alertInfo).getByText(bounceDetail.subject, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
