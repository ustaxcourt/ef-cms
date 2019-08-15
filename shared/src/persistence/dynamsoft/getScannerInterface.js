let DWObject = null;
let dynamsoftLoader = null;

exports.getScannerInterface = () => {
  const completeScanSession = async () => {
    DWObject.RemoveAllImages();
    DWObject.CloseSource();
  };

  const getScanCount = () => DWObject.HowManyImagesInBuffer;

  const getSources = () => {
    var count = DWObject.SourceCount;
    const sources = [];
    for (var i = 0; i < count; i++) {
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
    if (!process.env.CI && !dynamsoftLoader) {
      dynamsoftLoader = new Promise(resolve => {
        const dynamScriptClass = 'dynam-scanner-injection';

        // Create a script element to inject into the header
        const initiateScript = document.createElement('script');
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
        document.getElementsByTagName('head')[0].appendChild(initiateScript);
        document.getElementsByTagName('head')[0].appendChild(configScript);
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

  const startScanSession = ({ applicationContext }) => {
    return new Promise((resolve, reject) => {
      const onScanFinished = () => {
        const count = DWObject.HowManyImagesInBuffer;
        if (count === 0) reject(new Error('no images in buffer'));
        const promises = [];
        const response = { error: null, scannedBuffer: null };
        for (let index = 0; index < count; index++) {
          promises.push(
            new Promise((resolve, reject) => {
              DWObject.ConvertToBlob(
                [index],
                window['EnumDWT_ImageType'].IT_JPG,
                resolve,
                reject,
              );
            }),
          );
        }

        return Promise.all(promises)
          .then(async blobs => {
            const blobBuffers = [];

            for (let blob of blobs) {
              blobBuffers.push(
                await applicationContext.convertBlobToUInt8Array(blob),
              );
            }
            response.scannedBuffer = blobBuffers;
            DWObject.RemoveAllImages();
            resolve(response);
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
      DWObject.IfFeederEnabled = true;
      DWObject.IfDuplexEnabled = false;
      DWObject.PixelType = window['EnumDWT_PixelType'].TWPT_RGB;
      DWObject.PageSize = window['EnumDWT_CapSupportedSizes'].TWSS_A4;

      if (!DWObject.IfFeederLoaded) {
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
