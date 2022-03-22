const React = require('react');
const { mount, shallow } = require('enzyme');
const { StandingPretrialOrder } = require('./StandingPretrialOrder.jsx');

describe('StandingPretrialOrder', () => {
  let options;
  let trialInfo;

  beforeAll(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

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

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <StandingPretrialOrder options={options} trialInfo={trialInfo} />,
    );

    expect(wrapper.find('#caption-title').text()).toEqual('TEST PETITIONER,');
    expect(wrapper.find('#caption-extension').text()).toEqual(
      options.caseCaptionExtension,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${options.docketNumberWithSuffix}`,
    );
  });

  it('renders the trial location and formatted trial start date and time', () => {
    const wrapper = shallow(
      <StandingPretrialOrder options={options} trialInfo={trialInfo} />,
    );

    const trialInformation = wrapper.find('#trial-information-card');

    expect(trialInformation.text()).toContain(trialInfo.trialLocation);
    expect(trialInformation.text()).toContain(trialInfo.formattedStartTime);
    expect(trialInformation.text()).toContain(
      trialInfo.formattedStartDateWithDayOfWeek,
    );
  });

  it('renders the formatted trial judge signature', () => {
    const wrapper = shallow(
      <StandingPretrialOrder options={options} trialInfo={trialInfo} />,
    );

    const signature = wrapper.find('.judge-signature');

    expect(signature.text()).toContain(trialInfo.formattedServedDate);
    expect(signature.text()).toContain(
      `(Signed) ${trialInfo.formattedJudgeName}`,
    );
  });
});
