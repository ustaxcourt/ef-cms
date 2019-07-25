const { getScannerInterface } = require('./getScannerInterfaceInteractor');
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('');
global.window = jsdom.window;

window['EnumDWT_ImageType'] = { IT_PNG: 1 };
const mockSources = ['Test Source 1', 'Test Source 2'];
const mockScanCount = 1;

const mockAcquireImage = jest.fn();
const mockCloseSource = jest.fn();
const mockOpenSource = jest.fn();
const mockRemoveAllImages = jest.fn();

const DWObject = {
  AcquireImage: mockAcquireImage,
  CloseSource: mockCloseSource,
  ConvertToBlob: (
    indices,
    enumImageType,
    asyncSuccessFunc,
    asyncFailureFunc,
  ) => {
    const args = { asyncFailureFunc, asyncSuccessFunc, enumImageType, indices };
    return asyncSuccessFunc(args);
  },
  DataSource: null,
  DataSourceStatus: 0,
  ErrorCode: 0,
  ErrorString: 'Successful!',
  GetSourceNameItems: index => mockSources[index],
  HowManyImagesInBuffer: mockScanCount,
  IfDisableSourceAfterAcquire: false,
  OpenSource: mockOpenSource,
  RemoveAllImages: mockRemoveAllImages,
  SelectSourceByIndex: idx => {
    DWObject.DataSource = idx;
    return true;
  },
  SourceCount: mockSources.length,
};

const Dynamsoft = {
  WebTwainEnv: {
    GetWebTwain: () => DWObject,
  },
};

describe('getScannerInterface', () => {
  beforeEach(() => {
    window.Dynamsoft = { ...Dynamsoft };
  });

  it('returns the TWAIN driver API', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('DWObject');
  });

  it('has a method for completing the scan process', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('completeScanSession');
    await scannerAPI.completeScanSession();
    expect(mockRemoveAllImages).toHaveBeenCalled();
    expect(mockCloseSource).toHaveBeenCalled();
  });

  it('can get the page / scan count in the current buffer', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI.getScanCount()).toEqual(mockScanCount);
  });

  it('can get an array of available scanner sources', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const sources = scannerAPI.getSources();
    expect(sources).toHaveLength(mockSources.length);
  });

  it('can get current scan errors', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const errorObj = scannerAPI.getScanError();
    expect(errorObj).toHaveProperty('code');
    expect(errorObj).toHaveProperty('message');
  });

  it('can get a data source status', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI.getSourceStatus()).toEqual(0);
  });

  it('can set a scanner source by index', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    scannerAPI.setSourceByIndex(1);
    expect(scannerAPI.DWObject);
  });

  it('can set a scanner source by name', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    scannerAPI.setSourceByName(mockSources[0]);
    expect(scannerAPI.DWObject);
  });

  it('setSourceByName returns `false` when the source is not found', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    const result = scannerAPI.setSourceByName('Unavailable Source');
    expect(result).toBeFalsy();
  });

  it('has a method for starting the scan process', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(scannerAPI).toHaveProperty('startScanSession');
    await scannerAPI.startScanSession();
    expect(DWObject.IfDisableSourceAfterAcquire).toBeTruthy();
    expect(mockOpenSource).toHaveBeenCalled();
    expect(mockAcquireImage).toHaveBeenCalled();
  });
});
