const React = require('react');
const {
  NoticeOfTrialIssuedInPerson,
} = require('./NoticeOfTrialIssuedInPerson.jsx');
const { mount, shallow } = require('enzyme');

describe('NoticeOfTrialIssuedInPerson', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const trialInfo = {
    address1: '123 Candy Cane Lane',
    address2: '22222',
    city: 'troutville',
    formattedJudge: 'Judge Dredd',
    formattedStartDate: 'Monday, January 20, 2020',
    formattedStartTime: '10:00 am',
    postalCode: 'Boise, Idaho',
    state: '33333',
  };

  it('renders a document header with trial information', () => {
    const wrapper = mount(
      <NoticeOfTrialIssuedInPerson
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
      <NoticeOfTrialIssuedInPerson
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const trialInfoContent = wrapper.find('#trial-info').text();

    expect(trialInfoContent).toContain(trialInfo.address1);
    expect(trialInfoContent).toContain(trialInfo.address2);
    expect(trialInfoContent).toContain(trialInfo.city);
    expect(trialInfoContent).toContain(trialInfo.postalCode);
    expect(trialInfoContent).toContain(trialInfo.state);
  });

  it('renders the formatted judge name', () => {
    const wrapper = shallow(
      <NoticeOfTrialIssuedInPerson
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
      <NoticeOfTrialIssuedInPerson
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
