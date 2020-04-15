const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generatePrintableDocketRecordTemplate');

const applicationContext = createApplicationContext({});

describe('generatePrintableDocketRecordTemplate', () => {
  const content = {
    caseCaptionWithPostfix: 'Test Case Caption',
    docketNumberWithSuffix: '123-45S',
    docketRecord: '<table id="test-docket-record"></table>',
    partyInfo: '<table id="test-party-info"></table>',
  };

  it('Returns HTML with the given content', async () => {
    const result = await generatePrintableDocketRecordTemplate({
      applicationContext,
      content,
    });

    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Caption Postfix')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(
      result.indexOf('<table id="test-docket-record"></table>'),
    ).toBeGreaterThan(-1);
    expect(
      result.indexOf('<table id="test-party-info"></table>'),
    ).toBeGreaterThan(-1);
  });
});
