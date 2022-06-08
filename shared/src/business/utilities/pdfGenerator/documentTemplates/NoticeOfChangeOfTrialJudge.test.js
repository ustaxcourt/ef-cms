const React = require('react');
const {
  NoticeOfChangeOfTrialJudge,
} = require('./NoticeOfChangeOfTrialJudge.jsx');
const {
  PROCEDURE_TYPES_MAP,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../../entities/EntityConstants.js');
const { mount, shallow } = require('enzyme');

describe('NoticeOfChangeofTrialJudge', () => {
  const caseCaptionExtension = 'Petitioner(s)';
  const caseTitle = 'Test Petitioner';
  const docketNumberWithSuffix = '123-19S';
  const trialInfo = {
    caseProcedureType: PROCEDURE_TYPES_MAP.small,
    chambersPhoneNumber: '11111',
    formattedStartDate: 'Monday, January 20, 2020',
    priorJudgeTitleWithFullName: 'Judge Lorna G. Schofield',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    trialLocation: 'Boise, Idaho',
    trialLocationAndProceedingType: `Boise, Idaho, ${TRIAL_SESSION_PROCEEDING_TYPES.inPerson}`,
    updatedJudgeTitleWithFullName: 'Judge Jacqueline Nguyen',
  };

  it('should renders a document header with the case information', () => {
    const wrapper = mount(
      <NoticeOfChangeOfTrialJudge
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
      <NoticeOfChangeOfTrialJudge
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const noticeBodyContent = wrapper.find('#notice-body').text();
    expect(noticeBodyContent).toContain(trialInfo.chambersPhoneNumber);
    expect(noticeBodyContent).toContain(trialInfo.formattedStartDate);
    expect(noticeBodyContent).toContain(trialInfo.proceedingType);
    expect(noticeBodyContent).toContain(trialInfo.trialLocation);
  });

  it('should NOT render additional text when the caseProcedureType is "regular"', () => {
    const wrapper = shallow(
      <NoticeOfChangeOfTrialJudge
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const noticeBodyContent = wrapper.find('#notice-body').text();
    expect(noticeBodyContent).toContain('for Small Tax Cases');
  });

  it('should render additional text when the caseProcedureType is "small"', () => {
    const wrapper = shallow(
      <NoticeOfChangeOfTrialJudge
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={{
          ...trialInfo,
          caseProcedureType: PROCEDURE_TYPES_MAP.regular,
        }}
      />,
    );

    const noticeBodyContent = wrapper.find('#notice-body').text();
    expect(noticeBodyContent).not.toContain('for Small Tax Cases');
  });

  it('should render the formatted names of the previous and current trial judges', () => {
    const wrapper = shallow(
      <NoticeOfChangeOfTrialJudge
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        trialInfo={trialInfo}
      />,
    );

    const noticeBodyContent = wrapper.find('#notice-body').text();
    expect(noticeBodyContent).toContain(trialInfo.priorJudgeTitleWithFullName);
    expect(noticeBodyContent).toContain(
      trialInfo.updatedJudgeTitleWithFullName,
    );
  });
});
