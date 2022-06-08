const React = require('react');
const {
  NoticeOfChangeToRemoteProceeding,
} = require('./NoticeOfChangeToRemoteProceeding.jsx');
const { mount, shallow } = require('enzyme');

describe('NoticeOfChangeToRemoteProceeding', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const trialInfo = {
    chambersPhoneNumber: '11111',
    formattedJudge: 'Judge Dredd',
    formattedStartDate: 'Monday, January 20, 2020',
    formattedStartTime: '10:00 am',
    joinPhoneNumber: '11111',
    meetingId: '22222',
    password: '33333',
    trialLocation: 'Boise, Idaho',
  };

  it('renders a document header with trial information', () => {
    const wrapper = mount(
      <NoticeOfChangeToRemoteProceeding
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
      <NoticeOfChangeToRemoteProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const trialInfoContent = wrapper.find('#trial-info').text();

    expect(trialInfoContent).toContain(trialInfo.trialLocation);

    const noticeBodyContent = wrapper.find('#notice-body').text();

    expect(noticeBodyContent).toContain(trialInfo.meetingId);
    expect(noticeBodyContent).toContain(trialInfo.password);
    expect(noticeBodyContent).toContain(trialInfo.joinPhoneNumber);
  });

  it('renders the formatted judge name', () => {
    const wrapper = shallow(
      <NoticeOfChangeToRemoteProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    expect(wrapper.find('#judge-info').text()).toContain(
      trialInfo.formattedJudge,
    );
  });

  it('renders the formatted start date and time', () => {
    const wrapper = shallow(
      <NoticeOfChangeToRemoteProceeding
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );
    const textContent = wrapper.find('#notice-body').text();

    expect(textContent).toContain(trialInfo.formattedStartTime);
    expect(textContent).toContain(trialInfo.formattedStartDate);
  });
});
