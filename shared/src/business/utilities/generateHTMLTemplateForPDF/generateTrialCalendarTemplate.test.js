const {
  generateTrialCalendarTemplate,
} = require('./generateTrialCalendarTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateTrialCalendarTemplate', () => {
  const content = {
    formattedTrialSessionDetails: {
      formattedStartDateFull: '10/11/12 11:00 PM',
      trialLocation: 'Mobile, Alabama',
    },
    openCases: [],
  };

  it('generates a trial calendar', async () => {
    const result = await generateTrialCalendarTemplate({
      applicationContext,
      content,
    });
    expect(result.indexOf('10/11/12 11:00 PM')).toBeGreaterThan(-1);
  });
});
