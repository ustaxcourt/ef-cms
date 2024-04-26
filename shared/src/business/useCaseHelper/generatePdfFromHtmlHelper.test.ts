import { applicationContext } from '../test/createTestApplicationContext';
import { generatePdfFromHtmlHelper } from './generatePdfFromHtmlHelper';

describe('generatePdfFromHtmlHelper', () => {
  let pageContent = '';

  const launchMock = {
    newPage: () => {
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
  const setContentMock = jest.fn(contentHtml => (pageContent = contentHtml));
  const pdfMock = jest.fn(
    ({ displayHeaderFooter, footerTemplate, headerTemplate }) => {
      return `${displayHeaderFooter ? headerTemplate : ''}${pageContent}${
        displayHeaderFooter ? footerTemplate : ''
      }`;
    },
  );

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockImplementation(() => Buffer.from('hi'));
  });

  it('should call the error logger when an error is thrown', async () => {
    const mockErrorBrowser = jest.fn(() => {
      throw new Error('something');
    });

    await expect(
      generatePdfFromHtmlHelper(
        applicationContext,
        {
          contentHtml:
            '<!doctype html><html><head></head><body>Hello World</body></html>',
          docketNumber: '123-45',
        },
        mockErrorBrowser,
      ),
    ).rejects.toThrow();
    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('should not show the header on 1 page documents', async () => {
    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
      },
      launchMock,
    );

    expect(result.indexOf('<span class="pageNumber"></span>')).toEqual(-1);
    expect(result.indexOf('Docket No.:')).toEqual(-1);
  });

  it('should display alternate header html when headerHtml is given', async () => {
    const customHeader = 'Test Header';

    await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        headerHtml: customHeader,
      },
      launchMock,
    );

    const secondPageHeader = pdfMock.mock.calls[1][0].headerTemplate;
    expect(
      secondPageHeader.indexOf('Page <span class="pageNumber"></span>'),
    ).toEqual(-1); // This is in the header by default
    expect(secondPageHeader.indexOf(customHeader)).toBeGreaterThan(-1);
  });

  it('should display no header html when headerHtml is empty string', async () => {
    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        headerHtml: '',
      },
      launchMock,
    );

    expect(result.indexOf('Page <span class="pageNumber"></span>')).toEqual(-1); // This is in the header by default
  });

  it('should display alternate footer html when footerHtml is given', async () => {
    await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        footerHtml: 'Test Footer',
      },
      launchMock,
    );

    const firstPageFooter = pdfMock.mock.calls[0][0].footerTemplate;
    expect(firstPageFooter.indexOf('Test Footer')).toBeGreaterThan(-1);
  });

  it('should not show the default footer or additional footer content when overwriteFooter is set and footerHTML is not set', async () => {
    const result = await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        overwriteFooter: true,
      },
      launchMock,
    );

    const defaultFooterContent = 'class="footer-default"'; // This is in the footer by default
    expect(result.indexOf(defaultFooterContent)).toEqual(-1);
  });

  it('should overwrite the footer with footerHTML when overwriteFooter is set', async () => {
    const defaultFooterContent = 'class="footer-default"'; // This is in the footer by default

    await generatePdfFromHtmlHelper(
      applicationContext,
      {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        footerHtml: 'Test Footer',
        overwriteFooter: true,
      },
      launchMock,
    );

    const firstPageFooter = pdfMock.mock.calls[0][0].footerTemplate;
    expect(firstPageFooter.indexOf(defaultFooterContent)).toEqual(-1);
    expect(firstPageFooter.indexOf('Test Footer')).toBeGreaterThan(-1);
  });
});
