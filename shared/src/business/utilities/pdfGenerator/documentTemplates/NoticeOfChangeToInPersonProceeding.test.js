const React = require('react');
const {
  NoticeOfChangeToInPersonProceeding,
} = require('./NoticeOfChangeToInPersonProceeding.jsx');
const { mount, shallow } = require('enzyme');

describe('NoticeOfChangeToInPersonProceeding', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const trialInfo = {
    address1: '123 Taco Lane',
    address2: 'Suite Burrito 8',
    chambersPhoneNumber: '206-521-9987',
    city: 'Boise',
    courthouseName: 'Taco Bell',
    formattedJudge: 'Judge Hot Sauce',
    formattedStartDate: 'Monday, January 20, 2020',
    formattedStartTime: '10:00 am',
    state: 'ID',
    trialLocation: 'Boise, ID',
    zip: '23512',
  };

  it('should renders a header with the US Tax Court information', () => {
    const wrapper = mount(
      <NoticeOfChangeToInPersonProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    expect(wrapper.find('#primary-header')).toBeDefined();
  });

  it('should renders a header with the case information', () => {
    const wrapper = mount(
      <NoticeOfChangeToInPersonProceeding
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

  it('should render the trial session information', () => {
    const wrapper = shallow(
      <NoticeOfChangeToInPersonProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const trialInfoContent = wrapper.find('#trial-info').text();

    expect(trialInfoContent).toContain(trialInfo.courthouseName);
    expect(trialInfoContent).toContain(trialInfo.address1);
    expect(trialInfoContent).toContain(trialInfo.address2);
    expect(trialInfoContent).toContain(trialInfo.city);
    expect(trialInfoContent).toContain(trialInfo.state);
    expect(trialInfoContent).toContain(trialInfo.zip);
    expect(trialInfoContent).toContain('In-Person');
  });

  it('should render the information about the judge assigned to the trial session', () => {
    const wrapper = shallow(
      <NoticeOfChangeToInPersonProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const judgeInfoContent = wrapper.find('#judge-info').text();

    expect(judgeInfoContent).toContain(trialInfo.formattedJudge);
    expect(judgeInfoContent).toContain(trialInfo.chambersPhoneNumber);
  });

  it('should render the notice body with information about the trial location and start time', () => {
    const wrapper = shallow(
      <NoticeOfChangeToInPersonProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const noticeBodyInformation = wrapper.find('#notice-body').text();

    expect(noticeBodyInformation).toContain(trialInfo.trialLocation);
    expect(noticeBodyInformation).toContain(trialInfo.formattedStartDate);
    expect(noticeBodyInformation).toContain(trialInfo.formattedStartTime);
  });
});
