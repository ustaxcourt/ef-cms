const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');
const applicationContext = createApplicationContext({});
const { Case } = require('../../entities/cases/Case');

describe('generateHTMLTemplateForPDF', () => {
  const content = {
    caseCaptionWithPostfix: `Test Case Caption ${Case.CASE_CAPTION_POSTFIX}`,
    docketNumberWithSuffix: '123-45S',
    main: '<div>Test Main Content</div>',
  };

  const options = {
    h2: 'Test H2',
    h3: 'Test H3',
    styles: '#test-style { display: none; }',
    title: 'Test Title',
  };

  it('Returns HTML with the given content', async () => {
    const result = await generateHTMLTemplateForPDF({
      applicationContext,
      content,
    });
    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('U.S. Tax Court')).toBeGreaterThan(-1);
    expect(
      result.indexOf(`Test Case Caption ${Case.CASE_CAPTION_POSTFIX}`),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('<div>Test Main Content</div>')).toBeGreaterThan(-1);
  });

  it('Returns HTML with the given optional content', async () => {
    const result = await generateHTMLTemplateForPDF({
      applicationContext,
      content,
      options,
    });
    expect(result.indexOf('U.S. Tax Court')).toBe(-1);
    expect(result.indexOf('Test Title')).toBeGreaterThan(-1);
    expect(result.indexOf('#test-style { display: none; }')).toBeGreaterThan(
      -1,
    );
    expect(result.indexOf('<h2>Test H2</h2>')).toBeGreaterThan(-1);
    expect(result.indexOf('<h3>Test H3</h3>')).toBeGreaterThan(-1);
  });
});
