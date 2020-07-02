const React = require('react');
const { mount, shallow } = require('enzyme');
const { StandingPretrialNotice } = require('./StandingPretrialNotice.jsx');

describe('StandingPretrialNotice', () => {
  let options;
  let trialInfo;

  beforeAll(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    trialInfo = {
      address1: '123 Some St.',
      city: 'Some City',
      courthouseName: 'Hall of Justice',
      fullStartDate: 'Friday May 8, 2020',
      judge: {
        name: 'Test Judge',
      },
      postalCode: '12345',
      startDay: 'Friday',
      startTime: '10:00am',
      state: 'AL',
    };
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <StandingPretrialNotice options={options} trialInfo={trialInfo} />,
    );

    expect(wrapper.find('#caption-title').text()).toEqual(options.caseTitle);
    expect(wrapper.find('#caption-extension').text()).toEqual(
      options.caseCaptionExtension,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${options.docketNumberWithSuffix}`,
    );
  });

  it('renders the trial start date and time', () => {
    const wrapper = shallow(
      <StandingPretrialNotice options={options} trialInfo={trialInfo} />,
    );

    const trialInformation = wrapper.find('#trial-information');

    expect(trialInformation.text()).toContain(trialInfo.address1);
    expect(trialInformation.text()).toContain(trialInfo.city);
    expect(trialInformation.text()).toContain(trialInfo.state);
    expect(trialInformation.text()).toContain(trialInfo.postalCode);
  });

  it('renders the trial location information', () => {
    const wrapper = shallow(
      <StandingPretrialNotice options={options} trialInfo={trialInfo} />,
    );

    const trialInformation = wrapper.find('#trial-information');

    expect(trialInformation.text()).toContain(trialInfo.courthouseName);
    expect(trialInformation.text()).toContain(trialInfo.address1);
    expect(trialInformation.text()).toContain(trialInfo.city);
    expect(trialInformation.text()).toContain(trialInfo.state);
    expect(trialInformation.text()).toContain(trialInfo.postalCode);
  });

  it('renders the trial location information', () => {
    const wrapper = shallow(
      <StandingPretrialNotice options={options} trialInfo={trialInfo} />,
    );

    const trialLocation = wrapper.find('#trial-location');

    expect(trialLocation.text()).toContain(trialInfo.address1);
    expect(trialLocation.text()).toContain(trialInfo.city);
    expect(trialLocation.text()).toContain(trialInfo.state);
    expect(trialLocation.text()).toContain(trialInfo.postalCode);

    const optionalAddress = wrapper.find('.address-optional');
    expect(optionalAddress.length).toEqual(0);
  });

  it('renders optional trial location information if present', () => {
    const wrapper = shallow(
      <StandingPretrialNotice
        options={options}
        trialInfo={{
          ...trialInfo,
          address2: 'Address Two',
          address3: 'Address Three',
        }}
      />,
    );

    const trialLocation = wrapper.find('#trial-location');

    expect(trialLocation.text()).toContain('Address Two');
    expect(trialLocation.text()).toContain('Address Three');
  });

  it('renders the trial judge signature', () => {
    const wrapper = shallow(
      <StandingPretrialNotice options={options} trialInfo={trialInfo} />,
    );

    const signature = wrapper.find('.signature');

    expect(signature.text()).toContain(`(Signed) ${trialInfo.judge.name}`);
  });
});
