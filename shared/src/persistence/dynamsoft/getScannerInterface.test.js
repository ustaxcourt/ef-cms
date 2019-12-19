const { getScannerInterface } = require('./getScannerInterface');
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('');
global.window = jsdom.window;

window['EnumDWT_ImageType'] = { IT_PNG: 1 };
window['EnumDWT_PixelType'] = { TWPT_RGB: 1 };
window['EnumDWT_CapSupportedSizes'] = { TWSS_A4: 1 };
const mockSources = ['Test Source 1', 'Test Source 2'];
const mockScanCount = 1;

let onPostAllTransfersCb = null;

const mockAcquireImage = jest.fn(() => onPostAllTransfersCb());
const mockCloseSource = jest.fn();
const mockOpenSource = jest.fn();
const mockRemoveAllImages = jest.fn();

const applicationContext = {
  convertBlobToUInt8Array: () => new Uint8Array([]),
  getScannerResourceUri: () => 'abc',
};

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
  IfFeederLoaded: true,
  OpenSource: mockOpenSource,
  RegisterEvent: (event, cb) => {
    onPostAllTransfersCb = cb;
  },
  RemoveAllImages: mockRemoveAllImages,
  SelectSourceByIndex: idx => {
    DWObject.DataSource = idx;
    return true;
  },
  SourceCount: mockSources.length,
  UnregisterEvent: () => null,
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

    await scannerAPI.startScanSession({ applicationContext });
    expect(DWObject.IfDisableSourceAfterAcquire).toBeTruthy();
    expect(mockOpenSource).toHaveBeenCalled();
    expect(mockAcquireImage).toHaveBeenCalled();
  });

  describe('startScanSessions', () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    beforeEach(() => {
      jest.spyOn(DWObject, 'RemoveAllImages').mockImplementation(() => {
        throw new Error('RemoveAllImages Mock Error');
      });
    });
    afterEach(() => {
      DWObject.RemoveAllImages.mockRestore();
    });
    it('gracefully deals with failed blob conversion', async () => {
      let error;
      try {
        await scannerAPI.startScanSession({ applicationContext });
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  it('throws an exception if the hopper is empty', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject({
      ...DWObject,
      IfFeederLoaded: false,
    });

    let error;
    try {
      await scannerAPI.startScanSession({ applicationContext });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('can enable/disable duplex mode by calling startScanSession with option.duplexEnabled set to true or false', async () => {
    const scannerAPI = getScannerInterface();
    scannerAPI.setDWObject(DWObject);
    expect(DWObject.IfDuplexEnabled).toEqual(false); // default

    const options = {
      duplexEnabled: true,
    };

    await scannerAPI.startScanSession({ applicationContext, options });
    expect(DWObject.IfDuplexEnabled).toEqual(true);

    options.duplexEnabled = false;

    await scannerAPI.startScanSession({ applicationContext, options });
    expect(DWObject.IfDuplexEnabled).toEqual(false);
  });

  it('should attempt to load the dynamsoft libraries', async () => {
    delete global.document;
    let calls = 0;
    global.document = {
      addEventListener: () => null,
      createElement: () => ({
        cloneNode: function() {
          return {
            ...this,
          };
        },
        onload: null,
        setAttribute: () => null,
      }),
      getElementsByTagName: () => {
        calls++;
        return [
          {
            appendChild: script => {
              script.onload();
            },
          },
        ];
      },
    };
    // global.window.document = ;
    const scannerAPI = getScannerInterface();
    let script = await scannerAPI.loadDynamsoft({
      applicationContext,
    });
    expect(script).toEqual('dynam-scanner-injection');

    // try to load it again to verify it doesn't attempt to download the scripts again
    script = await scannerAPI.loadDynamsoft({
      applicationContext,
    });
    expect(script).toEqual('dynam-scanner-injection');
    expect(calls).toEqual(2);
  });
});
