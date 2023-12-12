import { downloadCsv } from '@web-client/presenter/utilities/downloadCsv';

const oldWindowUrl = window.URL;

const csvString = 'abc123';
const fileName = 'fileName';
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
  });

  it('creates csv and download link using provided csvString and fileName', () => {
    const expectedCsvBlob = new Blob([csvString], { type: 'text/csv' });
    const expectedAnchorElement = `<a id="download-csv" href="${mockUrl}" download="${fileName}"></a>`;

    downloadCsv({ csvString, fileName });

    expect(createObjectURLSpy).toHaveBeenCalledWith(expectedCsvBlob);
    expect(createElementSpy).toHaveBeenCalledWith('a');

    expect(anchorElement.outerHTML).toEqual(expectedAnchorElement);
  });

  it('clicks on download link', () => {
    const mockAnchorElement = {
      click: jest.fn(),
      setAttribute: jest.fn(),
    };
    createElementSpy.mockReturnValueOnce(mockAnchorElement);

    downloadCsv({ csvString, fileName });

    expect(mockAnchorElement.setAttribute).toHaveBeenCalledTimes(3);
    expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
  });
});
