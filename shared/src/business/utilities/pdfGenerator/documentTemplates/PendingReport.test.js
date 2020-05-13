const React = require('react');
const { mount, shallow } = require('enzyme');
const { PendingReport } = require('./PendingReport.jsx');

describe('PendingReport', () => {
  let pendingItems;

  beforeAll(() => {
    pendingItems = [
      {
        caseTitle: 'Test Petitioner',
        dateFiled: '02/02/20',
        docketNumberWithSuffix: '123-45S',
        filingsAndProceedings: 'Order',
        judge: 'Chief Judge',
        status: 'closed',
      },
    ];
  });

  it('renders a document header with the document title and subtitle', () => {
    const wrapper = mount(<PendingReport subtitle="Test Subtitle" />);

    expect(wrapper.find('#reports-header h1').text()).toEqual('Pending Report');
    expect(wrapper.find('#reports-header h2').text()).toEqual('Test Subtitle');
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
      pendingItems[0].dateFiled,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].caseTitle,
    );
    expect(tableData.find('tr').at(0).text()).toContain(
      pendingItems[0].filingsAndProceedings,
    );
    expect(tableData.find('tr').at(0).text()).toContain(pendingItems[0].status);
    expect(tableData.find('tr').at(0).text()).toContain(pendingItems[0].judge);
  });
});
