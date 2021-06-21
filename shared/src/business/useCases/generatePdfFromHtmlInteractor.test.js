const {
  generatePdfFromHtmlInteractor,
} = require('./generatePdfFromHtmlInteractor.js');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('generatePdfFromHtmlInteractor', () => {
  let pageContent = '';
  let closeMock;

  const launchMock = jest.fn();
  const launchErrorMock = jest.fn(() => {
    throw new Error('something');
  });
  const newPageMock = jest.fn();
  const setContentMock = jest.fn(contentHtml => (pageContent = contentHtml));
  const pdfMock = jest.fn(
    ({ displayHeaderFooter, footerTemplate, headerTemplate }) => {
      return `${displayHeaderFooter ? headerTemplate : ''}${pageContent}${
        displayHeaderFooter ? footerTemplate : ''
      }`;
    },
  );

  beforeEach(() => {
    closeMock = jest.fn();

    applicationContext.getChromiumBrowser.mockImplementation(() => {
      launchMock();
      return {
        close: closeMock,
        newPage: () => {
          newPageMock();
          return {
            pdf: pdfMock,
            setContent: setContentMock,
          };
        },
      };
    });
  });

  it('should call the error logger if an error is thrown', async () => {
    applicationContext.getChromiumBrowser.mockImplementation(() => {
      return launchErrorMock();
    });

    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      displayHeaderFooter: false,
      docketNumber: '123-45',
    };

    await expect(
      generatePdfFromHtmlInteractor(applicationContext, args),
    ).rejects.toThrow();
    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('should launch puppeteer to generate a new pdf', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      displayHeaderFooter: false,
      docketNumber: '123-45',
    };

    await generatePdfFromHtmlInteractor(applicationContext, args);

    expect(launchMock).toHaveBeenCalled();
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalled();
    expect(pdfMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should show header and footer by default', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
    };

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf('<span class="pageNumber"></span>')).toBeGreaterThan(
      -1,
    );
    expect(result.indexOf('Docket Number:')).toBeGreaterThan(-1);
  });

  it('should display alternate header html when headerHtml is given', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: 'Test Header',
    };

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(
      result.indexOf('Page <span class="pageNumber"></span>'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('Test Header')).toBeGreaterThan(-1);
  });

  it('should not show the default header or additional header content when overwriteHeader is set and headerHTML is not set', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      overwriteHeader: true,
    };
    const defaultHeaderContent = 'Page <span class="pageNumber"></span>'; // This is in the header by default

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf(defaultHeaderContent)).toEqual(-1);
  });

  it('should overwrite the header with headerHTML when overwriteHeader is set', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: 'Test Header',
      overwriteHeader: true,
    };
    const defaultHeaderContent = 'Page <span class="pageNumber"></span>'; // This is in the header by default

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf(defaultHeaderContent)).toEqual(-1);
    expect(result.indexOf('Test Header')).toBeGreaterThan(-1);
  });

  it('should display alternate footer html when footerHtml is given', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      footerHtml: 'Test Footer',
    };

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf('Test Footer')).toBeGreaterThan(-1);
  });

  it('should not show the default footer or additional footer content when overwriteFooter is set and footerHTML is not set', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      overwriteFooter: true,
    };
    const defaultFooterContent = 'class="footer-default"'; // This is in the footer by default

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf(defaultFooterContent)).toEqual(-1);
  });

  it('should overwrite the footer with footerHTML when overwriteFooter is set', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      footerHtml: 'Test Footer',
      overwriteFooter: true,
    };
    const defaultFooterContent = 'class="footer-default"'; // This is in the footer by default

    const result = await generatePdfFromHtmlInteractor(
      applicationContext,
      args,
    );

    expect(result.indexOf(defaultFooterContent)).toEqual(-1);
    expect(result.indexOf('Test Footer')).toBeGreaterThan(-1);
  });
});
