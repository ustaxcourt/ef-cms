const React = require('react');
const {
  TrialSessionPlanningReport,
} = require('./TrialSessionPlanningReport.jsx');
const { queryByAttribute, render, within } = require('@testing-library/react');

describe('TrialSessionPlanningReport', () => {
  const previousTerms = [
    {
      name: 'fall',
      termDisplay: 'Fall 2019',
      year: '2019',
    },
    {
      name: 'spring',
      termDisplay: 'Spring 2019',
      year: '2019',
    },
    {
      name: 'winter',
      termDisplay: 'Winter 2019',
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

  const getById = queryByAttribute.bind(null, 'id');

  it('should render a document header with the report term', () => {
    const { container } = render(
      <TrialSessionPlanningReport
        locationData={[]}
        previousTerms={[]}
        term={'Winter 2020'}
      />,
    );
    expect(
      within(getById(container, 'reports-header')).getByText(
        'Trial Session Planning Report',
      ),
    ).toBeInTheDocument();
    expect(
      within(getById(container, 'reports-header')).getByText('Winter 2020'),
    ).toBeInTheDocument();
  });

  it('should create table headings for the previous terms', () => {
    const { container } = render(
      <TrialSessionPlanningReport
        locationData={[]}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    expect(within(container).getByText('Fall 2019')).toBeInTheDocument();
    expect(within(container).getByText('Spring 2019')).toBeInTheDocument();
    expect(within(container).getByText('Winter 2019')).toBeInTheDocument();
  });

  it('should render the given location data for the given terms', () => {
    const { container } = render(
      <TrialSessionPlanningReport
        locationData={locationData}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    expect(within(container).getByText('Little Rock, AR')).toBeInTheDocument();
    expect(within(container).getByText('Mobile, AL')).toBeInTheDocument();
  });

  it('should render location term data or a calendar icon', () => {
    const { container } = render(
      <TrialSessionPlanningReport
        locationData={locationData}
        previousTerms={previousTerms}
        term={'Winter 2020'}
      />,
    );

    expect(within(container).getByText('(S) Buch')).toBeInTheDocument();
    expect(within(container).getByText('(R) Cohen')).toBeInTheDocument();

    // row 1 has 2 calendar icons while row 2 has 3
    expect(container.getElementsByClassName('calendar-icon').length).toEqual(5);
  });
});
