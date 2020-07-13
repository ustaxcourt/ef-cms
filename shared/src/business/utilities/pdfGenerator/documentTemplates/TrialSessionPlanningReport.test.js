const React = require('react');
const {
  TrialSessionPlanningReport,
} = require('./TrialSessionPlanningReport.jsx');
const { mount } = require('enzyme');

describe('TrialSessionPlanningReport', () => {
  const previousTerms = [
    {
      name: 'Fall',
      year: '2019',
    },
    {
      name: 'Spring',
      year: '2019',
    },
    {
      name: 'Winter',
      year: '2019',
    },
  ];

  const locationData = [
    {
      allCaseCount: 5,
      previousTermsData: [['(S) Buch', '(R) Cohen'], [], []],
      regularCaseCount: 3,
      smallCaseCount: 2,
      stateAbbreviation: 'AR',
      trialCityState: 'Little Rock, AR',
    },
    {
      allCaseCount: 2,
      previousTermsData: [[], [], []],
      regularCaseCount: 1,
      smallCaseCount: 1,
      stateAbbreviation: 'AL',
      trialCityState: 'Mobile, AL',
    },
  ];

  it('renders a document header with the report term', () => {
    const wrapper = mount(
      <TrialSessionPlanningReport
        locationData={[]}
        previousTerms={[]}
        term={'Winter 2020'}
      />,
    );

    expect(wrapper.find('#reports-header h2').text()).toEqual(
      'Trial Session Planning Report',
    );
    expect(wrapper.find('#reports-header h3').text()).toEqual('Winter 2020');
  });

  it('creates table headings for the previous terms', () => {
    const wrapper = mount(
      <TrialSessionPlanningReport
        locationData={[]}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    const tableHeaders = wrapper.find('table thead tr');

    expect(tableHeaders.text()).toContain('Fall 2019');
    expect(tableHeaders.text()).toContain('Spring 2019');
    expect(tableHeaders.text()).toContain('Winter 2019');
  });

  it('renders the given location data for the given terms', () => {
    const wrapper = mount(
      <TrialSessionPlanningReport
        locationData={locationData}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    const table = wrapper.find('table tbody tr');

    expect(table.at(0).text()).toContain('Little Rock, AR');
    expect(table.at(1).text()).toContain('Mobile, AL');
  });

  it('renders location term data or a calendar icon', () => {
    const wrapper = mount(
      <TrialSessionPlanningReport
        locationData={locationData}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    const tableRow = wrapper.find('table tbody tr');

    expect(tableRow.at(0).text()).toContain('(S) Buch');
    expect(tableRow.at(0).text()).toContain('(R) Cohen');

    expect(tableRow.at(1).find('div.calendar-icon').length).toEqual(3);
  });
});
