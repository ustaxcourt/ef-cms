const {
  generateTrialCalendarTemplate,
} = require('./generateTrialCalendarTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateTrialCalendarTemplate', () => {
  const content = {
    caption: 'Test Case Caption',
    captionPostfix: 'Test Caption Postfix',
    docketNumberWithSuffix: '123-45S',
    documentsFiledContent: '<div>Documents Filed Content</div>',
    filedAt: '10/03/19 3:09 pm ET',
    filedBy: 'Resp. & Petr. Garrett Carpenter',
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
