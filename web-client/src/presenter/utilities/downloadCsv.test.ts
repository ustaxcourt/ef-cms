import { downloadCsv } from '@web-client/presenter/utilities/downloadCsv';

const oldWindowUrl = window.URL;
const oldCreateElement = window.document.createElement;

const csvString = 'abc123';
const fileName = 'fileName';
const mockUrl = 'www.test.com';

let anchorElement;
let createElementSpy;
let createObjectURLSpy;
let revokeObjectURLSpy;

describe('downloadCsv', () => {
  beforeEach(() => {
    anchorElement = window.document.createElement('a');
    jest.spyOn(anchorElement, 'click');
    jest.spyOn(anchorElement, 'remove');
    jest.spyOn(anchorElement, 'setAttribute');

    createElementSpy = jest.fn().mockReturnValue(anchorElement);
    window.document.createElement = createElementSpy;

    createObjectURLSpy = jest.fn().mockReturnValue(mockUrl);
    revokeObjectURLSpy = jest.fn();

    window.URL.createObjectURL = createObjectURLSpy;
    window.URL.revokeObjectURL = revokeObjectURLSpy;
  });

  afterEach(() => {
    window.URL = oldWindowUrl;
    window.document.createElement = oldCreateElement;
    jest.restoreAllMocks();
  });

  it('creates a CSV Blob and generates an object URL', () => {
    const expectedCsvBlob = new Blob([csvString], { type: 'text/csv' });

    downloadCsv({ csvString, fileName });

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURLSpy.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.size).toEqual(expectedCsvBlob.size);
    expect(blobArg.type).toEqual(expectedCsvBlob.type);
  });

  it('creates an anchor element and sets attributes correctly', () => {
    downloadCsv({ csvString, fileName });

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'id',
      'download-csv',
    );
    expect(anchorElement.setAttribute).toHaveBeenCalledWith('href', mockUrl);
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'download',
      fileName,
    );
    const expectedAnchorElement = `<a id="download-csv" href="${mockUrl}" download="${fileName}"></a>`;
    expect(anchorElement.outerHTML).toEqual(expectedAnchorElement);
  });

  it('clicks on the anchor element and removes it after download', () => {
    downloadCsv({ csvString, fileName });
    expect(anchorElement.click).toHaveBeenCalledTimes(1);
    expect(anchorElement.remove).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after download', () => {
    downloadCsv({ csvString, fileName });
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
  });
});
