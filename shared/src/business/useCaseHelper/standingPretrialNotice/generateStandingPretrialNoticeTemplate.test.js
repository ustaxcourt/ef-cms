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
          irsPractitioners: [
            {
              contact: {
                phone: '123-456-7890',
              },
              name: 'Guy Fieri',
            },
          ],
          judge: { name: 'Test Judge' },
          postalCode: '12345',
          startDate: '2020-02-02T05:00:00.000Z',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('Courthouse Name')).toBeGreaterThan(-1);
    expect(result.indexOf('Address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('Address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('STANDING PRETRIAL NOTICE')).toBeGreaterThan(-1);
    expect(result.indexOf('10:00 AM')).toBeGreaterThan(-1);
    expect(result.indexOf('Sunday, February 2, 2020')).toBeGreaterThan(-1);
    expect(
      result.indexOf('Their name and phone number is Guy Fieri (123-456-7890)'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('(Signed) Test Judge')).toBeGreaterThan(-1);
  });

  it('does not return respondent information if the irsPractitioners field is NOT an array of respondent objects', async () => {
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
          irsPractitioners: {
            // will be ignored since it's not an array
            contact: {
              phone: '123-456-7890',
            },
            name: 'Guy Fieri',
          },
          judge: { name: 'Test Judge' },
          postalCode: '12345',
          startDate: '2020-02-02T05:00:00.000Z',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('Courthouse Name')).toBeGreaterThan(-1);
    expect(result.indexOf('Address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('Address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('STANDING PRETRIAL NOTICE')).toBeGreaterThan(-1);
    expect(result.indexOf('10:00 AM')).toBeGreaterThan(-1);
    expect(result.indexOf('Sunday, February 2, 2020')).toBeGreaterThan(-1);
    expect(
      result.indexOf('Their name and phone number is Guy Fieri (123-456-7890)'),
    ).toEqual(-1);
    expect(result.indexOf('(Signed) Test Judge')).toBeGreaterThan(-1);
  });
});
