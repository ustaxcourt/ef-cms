const {
  generatePdfFromHtmlInteractor,
} = require('./generatePdfFromHtmlInteractor.js');

let pageContent = '';

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

let closeMock;
let errorMock;

describe('generatePdfFromHtmlInteractor', () => {
  let applicationContext;

  beforeEach(() => {
    closeMock = jest.fn();
    errorMock = jest.fn();

    applicationContext = {
      getChromiumBrowser: () => {
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
      },
      logger: {
        error: () => null,
        time: () => null,
        timeEnd: () => null,
      },
    };
  });

  it('should call the error logger if an error is thrown', async () => {
    applicationContext = {
      getChromiumBrowser: () => {
        return launchErrorMock();
      },
      logger: {
        error: errorMock,
        time: () => null,
        timeEnd: () => null,
      },
    };

    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      displayHeaderFooter: false,
      docketNumber: '123-45',
    };

    let error;
    try {
      await generatePdfFromHtmlInteractor(args);
    } catch (err) {
      error = err;
    }
    expect(errorMock).toHaveBeenCalled();
    expect(error).toBeDefined();
  });

  it('should launch puppeteer to generate a new pdf', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      displayHeaderFooter: false,
      docketNumber: '123-45',
    };

    await generatePdfFromHtmlInteractor(args);
    expect(launchMock).toHaveBeenCalled();
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalled();
    expect(pdfMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should show header and footer by default', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
    };

    const result = await generatePdfFromHtmlInteractor(args);
    expect(result.indexOf('<span class="pageNumber"></span>')).toBeGreaterThan(
      -1,
    );
    expect(result.indexOf('Docket Number:')).toBeGreaterThan(-1);
  });

  it('should display alternate header html when headerHtml is given', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: 'Test Header',
    };

    const result = await generatePdfFromHtmlInteractor(args);
    expect(
      result.indexOf('Page <span class="pageNumber"></span>'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('Test Header')).toBeGreaterThan(-1);
  });

  it('should not show the default header or additional header content when overwriteHeader is set and headerHTML is not set', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      overwriteHeader: true,
    };

    const defaultHeaderContent = 'Page <span class="pageNumber"></span>'; // This is in the header by default

    const result = await generatePdfFromHtmlInteractor(args);

    expect(result.indexOf(defaultHeaderContent)).toEqual(-1);
  });

  it('should overwrite the header with headerHTML when overwriteHeader is set', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: 'Test Header',
      overwriteHeader: true,
    };

    const defaultHeaderContent = 'Page <span class="pageNumber"></span>'; // This is in the header by default

    const result = await generatePdfFromHtmlInteractor(args);

    expect(result.indexOf(defaultHeaderContent)).toEqual(-1);
    expect(result.indexOf('Test Header')).toBeGreaterThan(-1);
  });

  it('should display alternate footer html when footerHtml is given', async () => {
    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      footerHtml: 'Test Footer',
    };

    const result = await generatePdfFromHtmlInteractor(args);
    expect(result.indexOf('Test Footer')).toBeGreaterThan(-1);
  });
});
