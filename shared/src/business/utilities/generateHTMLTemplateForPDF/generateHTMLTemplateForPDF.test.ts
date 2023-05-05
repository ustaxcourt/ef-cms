import { applicationContext } from '../../test/createTestApplicationContext';
import { generateHTMLTemplateForPDF } from './generateHTMLTemplateForPDF';

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

  it('fails and logs if rendering sass fails', async () => {
    applicationContext.getNodeSass.mockReturnValue({
      render: (params, callback) => callback('there was an error'),
    });

    await expect(
      generateHTMLTemplateForPDF({
        applicationContext,
        content,
        options,
      }),
    ).rejects.toEqual('there was an error');
    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Error compiling SASS to CSS while generating PDF',
    );
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual(
      'there was an error',
    );
  });
});
