const React = require('react');
const { mount, shallow } = require('enzyme');
const { TrialCalendar } = require('./TrialCalendar.jsx');

describe('TrialCalendar', () => {
  let cases;
  let sessionDetail;

  beforeAll(() => {
    cases = [
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '123-45S',
        petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
        respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
      },
    ];

    sessionDetail = {
      address1: '123 Some Street',
      address2: 'Suite B',
      courtReporter: 'Lois Lane',
      courthouseName: 'Test Courthouse',
      formattedCityStateZip: 'New York, NY 10108',
      irsCalendarAdministrator: 'iCalRS Admin',
      judge: 'Joseph Dredd',
      notes: 'The one with the velour shirt is definitely looking at me funny.',
      sessionType: 'Hybrid',
      startDate: 'May 1, 2020',
      startTime: '10:00am',
      trialClerk: 'Clerky McGee',
      trialLocation: 'New York City, New York',
    };
  });

  it('renders a document header with the session start date and type concatenated', () => {
    const wrapper = mount(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    expect(wrapper.find('#reports-header h2').text()).toEqual(
      'New York City, New York',
    );
    expect(wrapper.find('#reports-header h3').text()).toEqual(
      'May 1, 2020 Hybrid',
    );
  });

  it('renders trial information', () => {
    const wrapper = shallow(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    expect(wrapper.find('#start-time').text()).toContain('10:00am');
    expect(wrapper.find('#location').text()).toContain('Test Courthouse');
    expect(wrapper.find('#location').text()).toContain('123 Some Street');
    expect(wrapper.find('#location').text()).toContain('Suite B');
    expect(wrapper.find('#location').text()).toContain('New York, NY 10108');
  });

  it('does not render location information if it is not entered', () => {
    const wrapper = shallow(
      <TrialCalendar
        cases={cases}
        sessionDetail={{
          ...sessionDetail,
          noLocationEntered: true,
        }}
      />,
    );

    expect(wrapper.find('#location').text()).toContain('No location entered');

    expect(wrapper.find('#location').text()).not.toContain('Test Courthouse');
    expect(wrapper.find('#location').text()).not.toContain('123 Some Street');
    expect(wrapper.find('#location').text()).not.toContain('Suite B');
    expect(wrapper.find('#location').text()).not.toContain(
      'New York, NY 10108',
    );
  });

  it('renders assignment information', () => {
    const wrapper = shallow(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    expect(wrapper.find('#assignments').text()).toContain('Joseph Dredd');
    expect(wrapper.find('#assignments').text()).toContain('Clerky McGee');
    expect(wrapper.find('#assignments').text()).toContain('Lois Lane');
    expect(wrapper.find('#assignments').text()).toContain('iCalRS Admin');
  });

  it('renders session notes', () => {
    const wrapper = shallow(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    expect(wrapper.find('#notes').text()).toContain(
      'The one with the velour shirt is definitely looking at me funny.',
    );
  });

  it('renders the number of open cases', () => {
    const wrapper = shallow(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    expect(wrapper.find('#cases-count').text()).toEqual(
      `Open Cases (${cases.length})`,
    );
  });

  it('renders a table with session case info', () => {
    const wrapper = mount(
      <TrialCalendar cases={cases} sessionDetail={sessionDetail} />,
    );

    const tableData = wrapper.find('table tbody');

    expect(tableData.find('tr').at(0).text()).toContain('123-45S');
    expect(tableData.find('tr').at(0).text()).toContain('Test Petitioner');
    expect(tableData.find('tr').at(0).text()).toContain('Ben Matlock');
    expect(tableData.find('tr').at(0).text()).toContain('Atticus Finch');
    expect(tableData.find('tr').at(0).text()).toContain('Sonny Crockett');
    expect(tableData.find('tr').at(0).text()).toContain('Ricardo Tubbs');
  });
});
