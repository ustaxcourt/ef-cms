const React = require('react');
const { mount, shallow } = require('enzyme');
const { NoticeOfTrialIssued } = require('./NoticeOfTrialIssued.jsx');

describe('NoticeOfTrialIssued', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const trialInfo = {
    address1: '123 Some St.',
    city: 'Somecity',
    judge: 'Judge Dredd',
    postalCode: '80008',
    startDate: '02/02/2020',
    startTime: '9:00 AM',
    state: 'ZZ',
  };

  it('renders a document header with trial information', () => {
    const wrapper = mount(
      <NoticeOfTrialIssued
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    expect(wrapper.find('#caption').text()).toContain(caseTitle);
    expect(wrapper.find('#caption').text()).toContain(caseCaptionExtension);
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${docketNumberWithSuffix}`,
    );
  });

  it('renders the trial information', () => {
    const wrapper = shallow(
      <NoticeOfTrialIssued
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const textContent = wrapper.find('#trial-info').text();

    expect(textContent).toContain(trialInfo.address1);
    expect(textContent).toContain(trialInfo.city);
    expect(textContent).toContain(trialInfo.state);
    expect(textContent).toContain(trialInfo.postalCode);
  });

  it('renders optional trial information', () => {
    const optionalTrialInfo = {
      ...trialInfo,
      address2: 'Suite B',
      courthouseName: 'Test Courthouse Name',
    };

    const wrapper = shallow(
      <NoticeOfTrialIssued
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={optionalTrialInfo}
      />,
    );

    const textContent = wrapper.find('#trial-info').text();

    expect(textContent).toContain(optionalTrialInfo.address2);
    expect(textContent).toContain(optionalTrialInfo.courthouseName);
  });

  it('renders the judge name', () => {
    const wrapper = shallow(
      <NoticeOfTrialIssued
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    expect(wrapper.find('#judge-info').text()).toContain(trialInfo.judge);
  });

  it('renders the start date and time', () => {
    const wrapper = shallow(
      <NoticeOfTrialIssued
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );
    const textContent = wrapper.find('#notice-body').text();

    expect(textContent).toContain(trialInfo.startTime);
    expect(textContent).toContain(trialInfo.startDate);
  });
});
