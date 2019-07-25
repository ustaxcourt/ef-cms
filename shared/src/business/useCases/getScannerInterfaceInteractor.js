exports.getScannerInterface = () => {
  const { Dynamsoft } = window;
  if (typeof Dynamsoft !== 'undefined') {
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    const DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');

    const completeScanSession = async () => {
      const count = DWObject.HowManyImagesInBuffer;
      const promises = [];
      const response = { error: null, scannedBuffer: null };

      for (let index = 0; index < count; index++) {
        promises.push(
          new Promise((resolve, reject) => {
            DWObject.ConvertToBlob(
              [index],
              window['EnumDWT_ImageType'].IT_PNG,
              data => {
                resolve(data);
              },
              reject,
            );
          }),
        );
      }

      return await Promise.all(promises)
        .then(async blobs => {
          const blobBuffers = [];

          for (let blob of blobs) {
            blobBuffers.push(
              new Uint8Array(await new Response(blob).arrayBuffer()),
            );
          }
          response.scannedBuffer = blobBuffers;
          return response;
        })
        .catch(err => {
          response.error = err;
          return response;
        })
        .finally(() => {
          DWObject.RemoveAllImages();
          DWObject.CloseSource();
        });
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

    const loadDynamsoft = ({ applicationContext, cb }) => {
      const dynanScriptClass = 'dynam-scanner-injection';

      // Create a script element to inject into the header
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.async = true;
      script1.setAttribute('class', dynanScriptClass);

      // Set a reference so we can remove later
      // store.set(state.scanner.dynanScriptClass, dynanScriptClass);

      // Reduce duplicating the above code
      const script2 = script1.cloneNode();

      // Set some state when the scripts are loaded
      script1.onload = function() {
        // store.set(state.scanner.initiateScriptLoaded, true);

        script2.onload = function() {
          // store.set(state.scanner.configScriptLoaded, true);
          cb(dynanScriptClass);
        };
      };

      // Handle script load errors?

      // Get the scanner resources URI based on applicationContext
      const scannerResourceUri = applicationContext.getScannerResourceUri();
      script1.src = `${scannerResourceUri}/dynamsoft.webtwain.initiate.js`;
      script2.src = `${scannerResourceUri}/dynamsoft.webtwain.config.js`;

      // Inject scripts into <head />
      document.getElementsByTagName('head')[0].appendChild(script1);
      document.getElementsByTagName('head')[0].appendChild(script2);
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

    const startScanSession = () => {
      DWObject.IfDisableSourceAfterAcquire = true;
      DWObject.OpenSource();
      DWObject.AcquireImage();
    };

    return {
      DWObject,
      completeScanSession,
      getScanCount,
      getScanError,
      getSourceNameByIndex,
      getSourceStatus,
      getSources,
      loadDynamsoft,
      setSourceByIndex,
      setSourceByName,
      startScanSession,
    };
  }
};
