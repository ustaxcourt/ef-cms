const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');
const applicationContext = createApplicationContext({});

describe('generateHTMLTemplateForPDF', () => {
  const content = '<div>Test Main Content</div>';

  const options = {
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
  });
});
