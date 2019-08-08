const {
  generateDocketRecordPdfInteractor,
} = require('./generateDocketRecordPdfInteractor.js');

const launchMock = jest.fn();
const newPageMock = jest.fn();
const setContentMock = jest.fn();
const pdfMock = jest.fn();
const closeMock = jest.fn();

describe('generateDocketRecordPdfInteractor', () => {
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
      docketNumber: '123-45',
      docketRecordHtml:
        '<!doctype html><html><head></head><body>Hello World</body></html>',
    };

    await generateDocketRecordPdfInteractor(args);
    expect(launchMock).toHaveBeenCalled();
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalled();
    expect(pdfMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
