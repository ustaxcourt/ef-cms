const React = require('react');
const { BouncedEmailAlert } = require('./BouncedEmailAlert.jsx');
const { shallow } = require('enzyme');

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
    const wrapper = shallow(
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

    const alertInfo = wrapper.find('#diagnostic-information');

    expect(alertInfo.text()).toContain(bounceDetail.bounceRecipient);
    expect(alertInfo.text()).toContain(bounceDetail.bounceSubType);
    expect(alertInfo.text()).toContain(bounceDetail.bounceType);
    expect(alertInfo.text()).toContain(bounceDetail.environmentName);
    expect(alertInfo.text()).toContain(bounceDetail.errorMessage);
    expect(alertInfo.text()).toContain(bounceDetail.subject);
  });
});
