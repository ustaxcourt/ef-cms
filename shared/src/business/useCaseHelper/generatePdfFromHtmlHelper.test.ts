import { applicationContext } from '../test/createTestApplicationContext';
import { generatePdfFromHtmlHelper } from './generatePdfFromHtmlHelper';

describe('generatePdfFromHtmlHelper', () => {
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

    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockImplementation(() => Buffer.from('hi'));

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
        process() {
          return {
            pid: '123',
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
      generatePdfFromHtmlHelper(applicationContext, args as any),
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

    await generatePdfFromHtmlHelper(applicationContext, args as any);

    expect(launchMock).toHaveBeenCalled();
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalled();
    expect(pdfMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should not show the header on 1 page documents', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
    };

    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      args as any,
    );

    expect(result.indexOf('<span class="pageNumber"></span>')).toEqual(-1);
    expect(result.indexOf('Docket No.:')).toEqual(-1);
  });

  it('should display alternate header html when headerHtml is given', async () => {
    const customHeader = 'Test Header';
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: customHeader,
    };

    await generatePdfFromHtmlHelper(applicationContext, args as any);

    const secondPageHeader = pdfMock.mock.calls[1][0].headerTemplate;
    expect(
      secondPageHeader.indexOf('Page <span class="pageNumber"></span>'),
    ).toEqual(-1); // This is in the header by default
    expect(secondPageHeader.indexOf(customHeader)).toBeGreaterThan(-1);
  });

  it('should display no header html when headerHtml is empty string', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: '',
    };

    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      args as any,
    );

    expect(result.indexOf('Page <span class="pageNumber"></span>')).toEqual(-1); // This is in the header by default
  });

  it('should display alternate footer html when footerHtml is given', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      footerHtml: 'Test Footer',
    };

    await generatePdfFromHtmlHelper(applicationContext, args as any);

    const firstPageFooter = pdfMock.mock.calls[0][0].footerTemplate;

    expect(firstPageFooter.indexOf('Test Footer')).toBeGreaterThan(-1);
  });

  it('should not show the default footer or additional footer content when overwriteFooter is set and footerHTML is not set', async () => {
    const args = {
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      overwriteFooter: true,
    };
    const defaultFooterContent = 'class="footer-default"'; // This is in the footer by default

    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      args as any,
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

    await generatePdfFromHtmlHelper(applicationContext, args as any);

    const firstPageFooter = pdfMock.mock.calls[0][0].footerTemplate;

    expect(firstPageFooter.indexOf(defaultFooterContent)).toEqual(-1);
    expect(firstPageFooter.indexOf('Test Footer')).toBeGreaterThan(-1);
  });
});
