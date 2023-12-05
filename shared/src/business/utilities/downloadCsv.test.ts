import { downloadCsv } from '@shared/business/utilities/downloadCsv';

const oldWindowUrl = window.URL;
// const oldDocument = window.document;

const mockUrl = 'www.test.com';

let createObjectURLSpy;
let anchorElement;
let createElementSpy;

describe('downloadCsv', () => {
  beforeAll(() => {
    createObjectURLSpy = jest.fn().mockReturnValue(mockUrl);
    anchorElement = window.document.createElement('a');
    createElementSpy = jest.fn().mockReturnValue(anchorElement);
    window.URL.createObjectURL = createObjectURLSpy;
    window.document.createElement = createElementSpy;
  });

  afterAll(() => {
    window.URL = oldWindowUrl;
    // window.document = oldDocument;
  });

  it('creates csv and download link using provided csvString and fileName', () => {
    const csvString = 'abc123';
    const expectedCsvBlob = new Blob([csvString], { type: 'text/csv' });
    const fileName = 'fileName';

    downloadCsv({ csvString, fileName });

    expect(createObjectURLSpy).toHaveBeenCalledWith(expectedCsvBlob);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    const expectedAnchorElement = `<a download="fileName" href="${mockUrl}" id="download-csv"/>`;
    // const expectedAnchorElement =
    //   '<a download="fileName" href="\'www.test.com\'" id="download-csv"/>';
    expect(anchorElement).toContain(expectedAnchorElement);
  });

  it('clicks on download link', () => {
    const mockAnchorElement = {
      click: jest.fn(),
      setAttribute: jest.fn(),
    };
    createElementSpy.mockReturnValueOnce(mockAnchorElement);
    const csvString = 'abc123';

    const fileName = 'fileName';

    downloadCsv({ csvString, fileName });

    expect(mockAnchorElement.setAttribute).toHaveBeenCalledTimes(3);
    expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
  });
});
