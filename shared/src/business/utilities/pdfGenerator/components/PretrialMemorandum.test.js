const React = require('react');
const { PretrialMemorandum } = require('./PretrialMemorandum.jsx');
const { shallow } = require('enzyme');

describe('PretrialMemorandum', () => {
  let trialInfo;

  beforeAll(() => {
    trialInfo = {
      chambersPhoneNumber: '123456',
      formattedJudgeName: 'Judge What',
      formattedServedDate: 'June 20, 2020',
      formattedStartDate: 'May 8, 2020',
      formattedStartDateWithDayOfWeek: 'Friday May 8, 2020',
      formattedStartTime: '10:00 am',
      startDay: 'Friday',
      trialLocation: 'Boise, Idaho',
    };
  });

  it('renders the formatted judge name and chambers phone number in footer', () => {
    const wrapper = shallow(<PretrialMemorandum trialInfo={trialInfo} />);

    const signature = wrapper.find('.final-page-footer');

    expect(signature.text()).toContain(trialInfo.formattedJudgeName);
    expect(signature.text()).toContain(trialInfo.chambersPhoneNumber);
  });
});
