let DWObject = null;
let dynamsoftLoader = null;

export const getScannerInterface = () => {
  const completeScanSession = () => {
    DWObject.RemoveAllImages();
    DWObject.CloseSource();
    return Promise.resolve(true);
  };

  const getScanCount = () => DWObject.HowManyImagesInBuffer;

  const getSources = () => {
    const count = DWObject.SourceCount;
    const sources = [];
    for (let i = 0; i < count; i++) {
      sources.push(DWObject.GetSourceNameItems(i));
    }
    return sources;
  };

  const getScanError = () => {
    return {
      code: DWObject.ErrorCode,
      message: DWObject.ErrorString,
    };
  };

  const loadDynamsoft = ({ applicationContext }) => {
    if (!dynamsoftLoader) {
      // eslint-disable-next-line no-async-promise-executor
      dynamsoftLoader = new Promise(async resolve => {
        await applicationContext.loadDWTLibrary();
        const { Dynamsoft } = window;
        Dynamsoft.DWT.ResourcesPath = "https://unpkg.com/dwt@latest/dist";
        Dynamsoft.DWT.ProductKey = applicationContext.getConstants().DYNAMSOFT_PRODUCT_KEYS;
        Dynamsoft.DWT.ScanDirectly = true;

        Dynamsoft.DWT.CreateDWTObject(
          'dwtcontrolContainer'
          , function (object) {
              DWObject = object;
              resolve('dynam-scanner-injection');
          }, function (exp) {
              console.error(exp)
          });
      });
    }

    return dynamsoftLoader;
  };



  const getSourceStatus = () => {
    // 0	The Data Source is closed
    // 1	The Data Source is opened
    // 2	The Data Source is enabled
    // 3	The Data Source is acquiring images
    return DWObject.DataSourceStatus;
  };


  const setSourceByIndex = index => {
    return DWObject.SelectSourceByIndex(index) > -1;
  };

  const getSourceNameByIndex = index => {
    const sources = getSources();
    return sources[index];
  };

  const setSourceByName = sourceName => {
    const sources = getSources();
    const index = sources.indexOf(sourceName);
    if (index > -1) {
      return setSourceByIndex(index);
    } else {
      // Handle case where a named sources isn't found
      return false;
    }
  };

  const setDWObject = dw => {
    DWObject = dw;
    ret.DWObject = DWObject;
  };

  const startScanSession = ({ applicationContext, scanMode }) => {
    const { SCAN_MODES } = applicationContext.getConstants();
    const duplexEnabled = scanMode === SCAN_MODES.DUPLEX;
    const feederEnabled = scanMode !== SCAN_MODES.FLATBED;

    return new Promise((resolve, reject) => {
      const onScanFinished = () => {
        const count = DWObject.HowManyImagesInBuffer;
        if (count === 0) {
          reject(new Error('no images in buffer'));
          return;
        }
        const promises = [];
        const response = { error: null, scannedBuffer: null };
        for (let index = 0; index < count; index++) {
          promises.push(
            new Promise((resolveImage, rejectImage) => {
              DWObject.ConvertToBlob(
                [index],
                window.Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG,
                resolveImage,
                rejectImage,
              );
            }),
          );
        }

        return Promise.all(promises)
          .then(async blobs => {
            const COVER_SHEET_WIDTH_IN_PX = 866;

            const scaledDownBlobs = await Promise.all(
              blobs.map(blob =>
                applicationContext
                  .getReduceImageBlob()
                  .toBlob(blob, { max: COVER_SHEET_WIDTH_IN_PX }),
              ),
            );

            const blobBuffers = await Promise.all(
              scaledDownBlobs.map(applicationContext.convertBlobToUInt8Array),
            );

            response.scannedBuffer = blobBuffers;
            DWObject.RemoveAllImages();
            return resolve(response);
          })
          .catch(err => {
            response.error = err;
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(response);
          })
          .finally(() => {
            DWObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
          });
      };

      // called when ALL pages are finished
      DWObject.RegisterEvent('OnPostAllTransfers', onScanFinished);

      DWObject.OpenSource();
      DWObject.IfDisableSourceAfterAcquire = true;
      DWObject.IfShowUI = false;
      DWObject.IfShowIndicator = false;
      DWObject.IfShowProgressBar = false;
      DWObject.Resolution = 300;
      DWObject.IfDuplexEnabled = duplexEnabled;
      DWObject.IfFeederEnabled = feederEnabled;
      DWObject.PixelType = window.Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB;
      DWObject.PageSize =
        window.Dynamsoft.DWT.EnumDWT_CapSupportedSizes.TWSS_A4;

      if (feederEnabled && !DWObject.IfFeederLoaded) {
        DWObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        return reject(new Error('no images in buffer'));
      }

      DWObject.AcquireImage(null, null, e => {
        DWObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return reject(e);
      });
    });
  };

  const ret = {
    DWObject,
    completeScanSession,
    getScanCount,
    getScanError,
    getSourceNameByIndex,
    getSourceStatus,
    getSources,
    loadDynamsoft,
    setDWObject,
    setSourceByIndex,
    setSourceByName,
    startScanSession,
  };

  return ret;
};
