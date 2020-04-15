const {
  generateStandingPretrialOrderTemplate,
} = require('./generateStandingPretrialOrderTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateStandingPretrialOrderTemplate', () => {
  const caseDetail = {
    caseCaption: 'Test Case Caption',
    docketNumber: '123-45',
    docketNumberSuffix: 'S',
  };

  it('Returns HTML with the given case and trial session data', async () => {
    const result = await generateStandingPretrialOrderTemplate({
      applicationContext,
      content: {
        caption: caseDetail.caseCaption,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        trialInfo: {
          city: 'City',
          judge: { name: 'Test Judge' },
          startDate: '2020-02-02T05:00:00.000Z',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Judge')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('STANDING PRE TRIAL ORDER')).toBeGreaterThan(-1);
    expect(
      result.indexOf('beginning on Sunday, February 2, 2020'),
    ).toBeGreaterThan(-1);
  });
});
