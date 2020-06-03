const React = require('react');
const { mount, shallow } = require('enzyme');
const { StandingPretrialOrder } = require('./StandingPretrialOrder.jsx');

describe('StandingPretrialOrder', () => {
  let options;
  let trialInfo;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    trialInfo = {
      city: 'Some City',
      fullStartDate: 'Friday May 8, 2020',
      judge: {
        name: 'Test Judge',
      },
      state: 'TEST STATE',
    };
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <StandingPretrialOrder options={options} trialInfo={trialInfo} />,
    );

    expect(wrapper.find('#caption-title').text()).toEqual(options.caseTitle);
    expect(wrapper.find('#caption-extension').text()).toEqual(
      options.caseCaptionExtension,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket Number ${options.docketNumberWithSuffix}`,
    );
  });

  it('renders a document with trial information', () => {
    const wrapper = shallow(
      <StandingPretrialOrder options={options} trialInfo={trialInfo} />,
    );
    expect(wrapper.text()).toContain(trialInfo.fullStartDate);
    expect(wrapper.text()).toContain(trialInfo.city);
    expect(wrapper.text()).toContain(trialInfo.state);
    expect(wrapper.text()).toContain(trialInfo.judge.name);
  });

  it('renders a document with a served date', () => {
    const wrapper = shallow(
      <StandingPretrialOrder
        footerDate="02/02/2020"
        options={options}
        trialInfo={trialInfo}
      />,
    );
    expect(wrapper.find('#served-stamp').text()).toEqual('Served 02/02/2020');
  });
});
