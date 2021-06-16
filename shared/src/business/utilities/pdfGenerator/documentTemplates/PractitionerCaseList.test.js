const React = require('react');
const { CASE_STATUS_TYPES } = require('../../../entities/EntityConstants.js');
const { mount, shallow } = require('enzyme');
const { PractitionerCaseList } = require('./PractitionerCaseList.jsx');

describe('PractitionerCaseList', () => {
  let openCases;
  let closedCases;

  beforeAll(() => {
    openCases = [
      {
        caseTitle: 'Test Open Case 1',
        docketNumberWithSuffix: '323-45S',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    closedCases = [
      {
        caseTitle: 'Test Closed Case 1',
        docketNumberWithSuffix: '123-45S',
        status: CASE_STATUS_TYPES.closed,
      },
      {
        caseTitle: 'Test Closed Case 2',
        docketNumberWithSuffix: '223-45S',
        status: CASE_STATUS_TYPES.closed,
      },
    ];
  });

  it('renders a document header with the practitioner name and bar number', () => {
    const wrapper = mount(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    expect(wrapper.find('#case-list-header h2').text()).toEqual('John Matlock');
    expect(wrapper.find('#case-list-header p').text()).toEqual('PT1234');
  });

  it('renders the open cases count', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    const openCaseCountEl = wrapper.find('#open-cases-count');

    expect(openCaseCountEl.text()).toEqual(`Open Cases (${openCases.length})`);
  });

  it('renders a table with open case information', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    const tableData = wrapper.find('table#open-cases tbody');

    expect(tableData.find('tr').at(0).text()).toContain(
      openCases[0].docketNumberWithSuffix,
    );
    expect(tableData.find('tr').at(0).text()).toContain(openCases[0].caseTitle);
    expect(tableData.find('tr').at(0).text()).toContain(openCases[0].status);
  });

  it('does not render the open cases table if there are no open cases', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={[]}
        practitionerName="John Matlock"
      />,
    );

    expect(wrapper.find('table#open-cases').length).toEqual(0);
  });

  it('renders the closed cases count', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    const closedCasesCountEl = wrapper.find('#closed-cases-count');

    expect(closedCasesCountEl.text()).toEqual(
      `Closed Cases (${closedCases.length})`,
    );
  });

  it('renders a table with closed case information', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={closedCases}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    const tableData = wrapper.find('table#closed-cases tbody');

    expect(tableData.find('tr').at(0).text()).toContain(
      closedCases[0].docketNumberWithSuffix,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      closedCases[0].caseTitle,
    );
  });

  it('does not render the open cases table if there are no closed cases', () => {
    const wrapper = shallow(
      <PractitionerCaseList
        barNumber="PT1234"
        closedCases={[]}
        openCases={openCases}
        practitionerName="John Matlock"
      />,
    );

    expect(wrapper.find('table#closed-cases').length).toEqual(0);
  });
});
