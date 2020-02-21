const {
  generateStandingPretrialNoticeTemplate,
} = require('./generateStandingPretrialNoticeTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateStandingPretrialNoticeTemplate', () => {
  const caseDetail = {
    caseCaption: 'Test Case Caption',
    caseCaptionPostfix: 'Test Caption Postfix',
    docketNumber: '123-45',
    docketNumberSuffix: 'S',
  };

  it('Returns HTML with the given case and trial session data', async () => {
    const result = await generateStandingPretrialNoticeTemplate({
      applicationContext,
      content: {
        caption: caseDetail.caseCaption,
        captionPostfix: caseDetail.caseCaptionPostfix,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        trialInfo: {
          address1: 'Address 1',
          address2: 'Address 2',
          city: 'City',
          courthouseName: 'Courthouse Name',
          judge: { name: 'Test Judge' },
          postalCode: '12345',
          respondents: [
            {
              contact: {
                phone: '123-456-7890',
              },
              name: 'Guy Fieri',
            },
          ],
          startDate: '2020-02-02T05:00:00.000Z',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    // TODO: Flesh this out further when template is done
    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('Guy Fieri')).toBeGreaterThan(-1);
    expect(result.indexOf('STANDING PRETRIAL NOTICE')).toBeGreaterThan(-1);
  });

  it('Returns HTML with the given case and trial session data with an incorrect respondent structure', async () => {
    const result = await generateStandingPretrialNoticeTemplate({
      applicationContext,
      content: {
        caption: caseDetail.caseCaption,
        captionPostfix: caseDetail.caseCaptionPostfix,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        trialInfo: {
          address1: 'Address 1',
          address2: 'Address 2',
          city: 'City',
          courthouseName: 'Courthouse Name',
          judge: { name: 'Test Judge' },
          postalCode: '12345',
          respondents: {
            contact: {
              phone: '123-456-7890',
            },
            name: 'Guy Fieri',
          },
          startDate: '2020-02-02T05:00:00.000Z',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    // TODO: Flesh this out further when template is done
    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('Guy Fieri')).toEqual(-1);
    expect(result.indexOf('STANDING PRETRIAL NOTICE')).toBeGreaterThan(-1);
  });
});
