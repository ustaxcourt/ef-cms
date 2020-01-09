const {
  generateTrialSessionPlanningReportTemplate,
} = require('./generateTrialSessionPlanningReportTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateTrialSessionPlanningReportTemplate', () => {
  const content = {
    previousTerms: [
      { term: 'fall', year: '2020' },
      { term: 'spring', year: '2020' },
      { term: 'winter', year: '2019' },
    ],
    rows: [
      {
        allCaseCount: 4,
        previousTermsData: [['(S) Ashford'], ['(S) Buch', '(R) Armen'], []],
        regularCaseCount: 2,
        smallCaseCount: 2,
        stateAbbreviation: 'AL',
        trialCityState: 'Birmingham, Alabama',
      },
    ],
    selectedTerm: 'winter',
    selectedYear: '2020',
  };

  it('generates a trial session planning report', async () => {
    const result = await generateTrialSessionPlanningReportTemplate({
      applicationContext,
      content,
    });

    expect(result.indexOf('<td>(S) Buch<br />(R) Armen</td>')).toBeGreaterThan(
      -1,
    );
    expect(
      result.indexOf('<td><div class="calendar-icon"></div></td>'),
    ).toBeGreaterThan(-1);
  });
});
