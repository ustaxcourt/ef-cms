const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generatePrintableDocketRecordTemplate');
const { Case } = require('../../entities/cases/Case');

const applicationContext = createApplicationContext({});

describe('generatePrintableDocketRecordTemplate', () => {
  const data = {
    caseCaptionExtension: 'Petitioner(s)',
    caseDetail: {
      contactPrimary: {},
      irsPractitioners: [],
      partyType: 'Petitioner',
      privatePractitioners: [],
    },
    caseTitle: 'Test Case Title',
    docketNumberWithSuffix: '123-45S',
    entries: [],
  };

  it('Returns HTML with the given content', async () => {
    const result = await generatePrintableDocketRecordTemplate({
      applicationContext,
      data,
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf(data.caseTitle)).toBeGreaterThan(-1);
    expect(result.indexOf(data.caseCaptionExtension)).toBeGreaterThan(-1);
    expect(result.indexOf(Case.CASE_CAPTION_POSTFIX)).toBeGreaterThan(-1);
    expect(result.indexOf(data.docketNumberWithSuffix)).toBeGreaterThan(-1);
    expect(result.indexOf('<div class="party-info"')).toBeGreaterThan(-1);
    expect(result.indexOf('<table id="documents">')).toBeGreaterThan(-1);
  });
});
