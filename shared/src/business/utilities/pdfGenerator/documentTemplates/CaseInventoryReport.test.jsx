const React = require('react');
const { CaseInventoryReport } = require('./CaseInventoryReport.jsx');
const { shallow } = require('enzyme');

describe('CaseInventoryReport', () => {
  it('should hide the status and judge header if false pass for both', () => {
    let wrapper = shallow(
      <CaseInventoryReport
        formattedCases={[{ docketNumber: '101' }, { docketNumber: '102' }]}
        reportTitle="Hello World"
        showJudgeColumn={false}
        showStatusColumn={false}
      />,
    );
    expect(wrapper.find('.status-header').length).toEqual(0);
    expect(wrapper.find('.judge-header').length).toEqual(0);
  });

  it('should show the status and judge header if false pass for both', () => {
    let wrapper = shallow(
      <CaseInventoryReport
        formattedCases={[{ docketNumber: '101' }, { docketNumber: '102' }]}
        reportTitle="Hello World"
        showJudgeColumn={true}
        showStatusColumn={true}
      />,
    );
    expect(wrapper.find('.status-header').length).toEqual(1);
    expect(wrapper.find('.judge-header').length).toEqual(1);
  });

  it('should render the correct number of cases', () => {
    let wrapper = shallow(
      <CaseInventoryReport
        formattedCases={[{ docketNumber: '101' }, { docketNumber: '102' }]}
        reportTitle="Hello World"
        showJudgeColumn={true}
        showStatusColumn={true}
      />,
    );
    expect(wrapper.find('tbody tr').length).toEqual(2);
  });

  it('should hide the judge and status columns when false', () => {
    let wrapper = shallow(
      <CaseInventoryReport
        formattedCases={[{ docketNumber: '101' }, { docketNumber: '102' }]}
        reportTitle="Hello World"
        showJudgeColumn={false}
        showStatusColumn={false}
      />,
    );
    expect(wrapper.find('tbody tr .status-column').length).toEqual(0);
    expect(wrapper.find('tbody tr .judge-column').length).toEqual(0);
  });

  it('should show the judge and status columns when true', () => {
    let wrapper = shallow(
      <CaseInventoryReport
        formattedCases={[{ docketNumber: '101' }, { docketNumber: '102' }]}
        reportTitle="Hello World"
        showJudgeColumn={true}
        showStatusColumn={true}
      />,
    );
    expect(wrapper.find('tbody tr .status-column').length).toEqual(2);
    expect(wrapper.find('tbody tr .judge-column').length).toEqual(2);
  });
});
