import { downloadXlsx } from '@web-client/presenter/utilities/downloadXlsx';

const oldWindowUrl = window.URL;
const oldCreateElement = window.document.createElement;

const encodedXlsxArray = [65, 66, 67];
const fileName = 'fileName';
const mockUrl = 'www.test.com';

let anchorElement;
let createElementSpy;
let createObjectURLSpy;
let revokeObjectURLSpy;

describe('downloadXlsx', () => {
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

  it('should create a blob and generate an object URL', () => {
    downloadXlsx({ encodedXlsxArray, fileName });

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURLSpy.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.size).toBe(
      new Blob([new Uint8Array(encodedXlsxArray)]).size,
    );
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'id',
      'download-xlsx',
    );
    expect(anchorElement.setAttribute).toHaveBeenCalledWith('href', mockUrl);
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'download',
      `${fileName}.xlsx`,
    );
    expect(anchorElement.click).toHaveBeenCalledTimes(1);
    expect(anchorElement.remove).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
  });

  it('creates an anchor element and sets attributes correctly', () => {
    downloadXlsx({ encodedXlsxArray, fileName });

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'id',
      'download-xlsx',
    );
    expect(anchorElement.setAttribute).toHaveBeenCalledWith('href', mockUrl);
    expect(anchorElement.setAttribute).toHaveBeenCalledWith(
      'download',
      `${fileName}.xlsx`,
    );
    const expectedAnchorElement = `<a id="download-xlsx" href="${mockUrl}" download="${fileName}.xlsx"></a>`;
    expect(anchorElement.outerHTML).toEqual(expectedAnchorElement);
  });

  it('clicks on the anchor element and removes it after download', () => {
    downloadXlsx({ encodedXlsxArray, fileName });
    expect(anchorElement.click).toHaveBeenCalledTimes(1);
    expect(anchorElement.remove).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after download', () => {
    downloadXlsx({ encodedXlsxArray, fileName });
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
  });
});
