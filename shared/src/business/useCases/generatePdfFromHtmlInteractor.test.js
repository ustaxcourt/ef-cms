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
const closeMock = jest.fn();
const errorMock = jest.fn();

describe('generatePdfFromHtmlInteractor', () => {
  it('should call the error logger if an error is thrown', async () => {
    const applicationContext = {
      getChromium: () => {
        return {
          puppeteer: {
            launch: () => {
              return launchErrorMock();
            },
          },
        };
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
    const applicationContext = {
      getChromium: () => {
        return {
          puppeteer: {
            launch: () => {
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
          },
        };
      },
      logger: {
        error: () => null,
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

    await generatePdfFromHtmlInteractor(args);
    expect(launchMock).toHaveBeenCalled();
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalled();
    expect(pdfMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it('should show header and footer by default', async () => {
    const applicationContext = {
      getChromium: () => {
        return {
          puppeteer: {
            launch: () => {
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
          },
        };
      },
      logger: {
        error: () => null,
        time: () => null,
        timeEnd: () => null,
      },
    };

    const args = {
      applicationContext,
      contentHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
      docketNumber: '123-45',
      headerHtml: 'Test Header',
    };

    const result = await generatePdfFromHtmlInteractor(args);
    expect(result.indexOf('<span class="pageNumber"></span>')).toBeGreaterThan(
      -1,
    );
    expect(result.indexOf('Test Header')).toBeGreaterThan(-1);
  });
});
