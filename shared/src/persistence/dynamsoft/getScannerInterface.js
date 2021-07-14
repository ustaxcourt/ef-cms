let DWObject = null;
let dynamsoftLoader = null;

exports.getScannerInterface = () => {
  const completeScanSession = async () => {
    DWObject.RemoveAllImages();
    DWObject.CloseSource();
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
      dynamsoftLoader = new Promise(resolve => {
        const dynamScriptClass = 'dynam-scanner-injection';

        // Create a script element to inject into the header
        const initiateScript = window.document.createElement('script');
        initiateScript.type = 'text/javascript';
        initiateScript.async = true;
        initiateScript.setAttribute('class', dynamScriptClass);

        // Reduce duplicating the above code
        const configScript = initiateScript.cloneNode();

        let leftToLoad = 2;

        const handleScriptOnLoad = () => {
          leftToLoad--;
          if (leftToLoad <= 0) {
            const interval = setInterval(() => {
              const { Dynamsoft } = window;
              Dynamsoft.WebTwainEnv.ScanDirectly = true;
              DWObject = Dynamsoft.WebTwainEnv.GetWebTwain(
                'dwtcontrolContainer',
              );
              if (!DWObject) return;

              clearInterval(interval);
              resolve(dynamScriptClass);
            }, 100);
          }
        };

        // Set some state when the scripts are loaded
        initiateScript.onload = handleScriptOnLoad;
        configScript.onload = handleScriptOnLoad;

        // Handle script load errors?

        // Get the scanner resources URI based on applicationContext
        const scannerResourceUri = applicationContext.getScannerResourceUri();

        initiateScript.src = `${scannerResourceUri}/dynamsoft.webtwain.initiate.js`;
        configScript.src = `${scannerResourceUri}/dynamsoft.webtwain.config.js`;

        // Inject scripts into <head />
        window.document
          .getElementsByTagName('head')[0]
          .appendChild(initiateScript);
        window.document
          .getElementsByTagName('head')[0]
          .appendChild(configScript);
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
            // eslint-disable-next-line promise/param-names
            new Promise((resolveImage, rejectImage) => {
              DWObject.ConvertToBlob(
                [index],
                window['EnumDWT_ImageType'].IT_JPG,
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
      DWObject.PixelType = window['EnumDWT_PixelType'].TWPT_RGB;
      DWObject.PageSize = window['EnumDWT_CapSupportedSizes'].TWSS_A4;

      if (feederEnabled && !DWObject.IfFeederLoaded) {
        DWObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        return reject(new Error('no images in buffer'));
      }

      DWObject.AcquireImage(null, null, e => {
        DWObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
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
