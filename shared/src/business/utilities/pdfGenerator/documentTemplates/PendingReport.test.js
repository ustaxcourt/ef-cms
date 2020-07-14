const React = require('react');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} = require('../../../entities/EntityConstants.js');
const { mount, shallow } = require('enzyme');
const { PendingReport } = require('./PendingReport.jsx');

describe('PendingReport', () => {
  let pendingItems;

  beforeAll(() => {
    pendingItems = [
      {
        associatedJudgeFormatted: CHIEF_JUDGE,
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '123-45S',
        formattedFiledDate: '02/02/20',
        formattedName: 'Order',
        status: CASE_STATUS_TYPES.closed,
      },
    ];
  });

  it('renders a document header with the document title and subtitle', () => {
    const wrapper = mount(<PendingReport subtitle="Test Subtitle" />);

    expect(wrapper.find('#reports-header h2').text()).toEqual('Pending Report');
    expect(wrapper.find('#reports-header h3').text()).toEqual('Test Subtitle');
  });

  it('renders a table with pending item information', () => {
    const wrapper = shallow(
      <PendingReport pendingItems={pendingItems} subtitle="Test Subtitle" />,
    );

    const tableData = wrapper.find('table tbody');

    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].docketNumberWithSuffix,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].formattedFiledDate,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].caseTitle,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].formattedName,
    );
    expect(tableData.find('tr').at(0).text()).toContain(pendingItems[0].status);
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].associatedJudgeFormatted,
    );
  });
});
