const {
  generatePrintableFilingReceiptTemplate,
} = require('./generatePrintableFilingReceiptTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generatePrintableFilingReceiptTemplate', () => {
  const content = {
    caption: 'Test Case Caption',
    docketNumberWithSuffix: '123-45S',
    documentsFiledContent: '<div>Documents Filed Content</div>',
    filedAt: '10/03/19 3:09 pm ET',
    filedBy: 'Resp. & Petr. Garrett Carpenter',
  };

  it('Returns HTML with the given content', async () => {
    const result = await generatePrintableFilingReceiptTemplate({
      applicationContext,
      content,
    });

    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Caption Postfix')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(
      result.indexOf('<div>Documents Filed Content</div>'),
    ).toBeGreaterThan(-1);
    expect(
      result.indexOf('Filed by Resp. & Petr. Garrett Carpenter'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('Filed 10/03/19 3:09 pm ET')).toBeGreaterThan(-1);
  });
});
