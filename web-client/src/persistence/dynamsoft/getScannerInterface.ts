// Dynamsoft does not offer types, as far as I can tell. This type is therefore based on Dynamsoft's documentation as of 2025 March.
type WebTwainObjectType = {
  readonly SourceCount: number;
  readonly HowManyImagesInBuffer: number;
  readonly ErrorCode: number;
  readonly ErrorString: string;
  readonly DataSourceStatus: number;
  readonly IfFeederLoaded: boolean;
  OpenSource: () => boolean;
  AcquireImage: (
    successCallBack: () => void,
    failureCallBack: (errorCode: number, errorString: string) => void,
  ) => void;
  GetSourceNameItems: (index: number) => string;
  RemoveAllImages: () => boolean;
  CloseSource: () => boolean;
  SelectSourceByIndex: (index: number) => boolean;
  RegisterEvent: (name: string, callback: (...arg: any[]) => void) => boolean;
  UnregisterEvent: (
    name: string,
    callback?: (...arg: any[]) => void,
  ) => boolean;
  ConvertToBlob(
    indices: number[],
    type: number, // a Dynamsoft-specific enum
    successCallback: (result: Blob, indices: number[], type: number) => void,
    failureCallBack: (errorCode: number, errorString: string) => void,
  ): void;
  IfDisableSourceAfterAcquire: boolean;
  IfShowUI: boolean;
  IfShowIndicator: boolean;
  IfShowProgressBar: boolean;
  Resolution: number;
  IfDuplexEnabled: boolean;
  IfFeederEnabled: boolean;
  PixelType: number; // a Dynamsoft-specific enum
  PageSize: number; // a Dynamsoft-specific enum
};

type DynamsoftWindow = Window & typeof globalThis & { Dynamsoft: any };
let DWObject: WebTwainObjectType | null = null; // Dynamsoft does not offer good types
let dynamsoftLoader: Promise<unknown> | null = null;

export const getScannerInterface = () => {
  const completeScanSession = () => {
    DWObject?.RemoveAllImages();
    DWObject?.CloseSource();
    return Promise.resolve(true);
  };

  const getScanCount = () => DWObject?.HowManyImagesInBuffer;

  const getSources = () => {
    if (!DWObject) {
      return [];
    }
    const count = DWObject.SourceCount;
    const sources: string[] = [];
    for (let i = 0; i < count; i++) {
      sources.push(DWObject.GetSourceNameItems(i));
    }
    return sources;
  };

  const getScanError = (): { code: number; message: string } | undefined => {
    if (!DWObject) {
      return undefined;
    }
    return {
      code: DWObject.ErrorCode,
      message: DWObject.ErrorString,
    };
  };

  const getInjectableDynamsoftScript = (
    dynamScriptClass: string,
  ): HTMLScriptElement => {
    const dynamsoftScript = window.document.createElement('script');
    dynamsoftScript.type = 'text/javascript';
    dynamsoftScript.async = true;
    dynamsoftScript.setAttribute('class', dynamScriptClass);
    return dynamsoftScript;
  };

  const loadDynamsoft = async ({ applicationContext }) => {
    if (!dynamsoftLoader) {
      dynamsoftLoader = (async () => {
        const dynamScriptClass = 'dynam-scanner-injection';

        // Create script elements
        const initiateScript = getInjectableDynamsoftScript(dynamScriptClass);
        const configScript = getInjectableDynamsoftScript(dynamScriptClass);
        const scannerResourceUri = applicationContext.getScannerResourceUri();
        initiateScript.src = `${scannerResourceUri}/dynamsoft.webtwain.initiate.js`;
        configScript.src = `${scannerResourceUri}/dynamsoft.webtwain.config.js`;

        // Load scripts
        const loadScript = script =>
          new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () =>
              reject(new Error(`Failed to load script: ${script.src}`));
            window.document.head.appendChild(script);
          });
        await Promise.all([
          loadScript(initiateScript),
          loadScript(configScript),
        ]);

        // Poll for the DWObject readiness with a timeout
        await new Promise<void>((resolve, reject) => {
          const maxAttempts = 100; // 10 seconds
          let attempts = 0;
          const interval = setInterval(() => {
            const { Dynamsoft } = window as DynamsoftWindow;
            if (Dynamsoft) {
              Dynamsoft.DWT.ScanDirectly = true;
              DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
              if (DWObject) {
                clearInterval(interval);
                return resolve();
              }
            }
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              return reject(
                new Error('Timed out waiting for Dynamsoft to load'),
              );
            }
          }, 100);
        });

        return dynamScriptClass;
      })();
    }
    return dynamsoftLoader;
  };

  const getSourceStatus = () => {
    // 0	The Data Source is closed
    // 1	The Data Source is opened
    // 2	The Data Source is enabled
    // 3	The Data Source is acquiring images
    return DWObject?.DataSourceStatus;
  };

  const setSourceByIndex = (index): boolean => {
    return DWObject?.SelectSourceByIndex(index) || false;
  };

  const getSourceNameByIndex = (index: number): string | undefined => {
    const sources = getSources();
    if (!sources.length) {
      return undefined;
    }
    return sources[index];
  };

  const setSourceByName = (sourceName: string): boolean => {
    const sources = getSources();
    const index = sources.indexOf(sourceName);
    if (index > -1) {
      return setSourceByIndex(index);
    } else {
      return false;
    }
  };

  const setDWObject = dw => {
    DWObject = dw;
    ret.DWObject = DWObject;
  };

  const startScanSession = ({
    applicationContext,
    scanMode,
  }): Promise<{
    error: Error | null;
    scannedBuffer: Uint8Array<ArrayBuffer>[] | null;
  }> => {
    const { SCAN_MODES } = applicationContext.getConstants();
    const duplexEnabled = scanMode === SCAN_MODES.DUPLEX;
    const feederEnabled = scanMode !== SCAN_MODES.FLATBED;

    return new Promise((resolve, reject) => {
      const onScanFinished = () => {
        if (!DWObject) {
          reject(new Error('Dynamsoft is not loaded'));
          return;
        }
        const count = DWObject.HowManyImagesInBuffer || 0;
        if (count === 0) {
          reject(new Error('no images in buffer'));
          return;
        }
        const promises: Promise<Blob>[] = [];
        const response: {
          error: Error | null;
          scannedBuffer: Uint8Array<ArrayBuffer>[] | null;
        } = { error: null, scannedBuffer: null };
        for (let index = 0; index < count; index++) {
          promises.push(
            new Promise((resolveImage, rejectImage) => {
              DWObject?.ConvertToBlob(
                [index],
                (window as DynamsoftWindow).Dynamsoft.DWT.EnumDWT_ImageType
                  .IT_JPG,
                resolveImage,
                rejectImage,
              );
            }),
          );
        }

        return Promise.all(promises)
          .then(async blobs => {
            const COVER_SHEET_WIDTH_IN_PX = 866;

            const scaledDownBlobs: Blob[] = await Promise.all(
              blobs.map(blob =>
                applicationContext
                  .getReduceImageBlob()
                  .toBlob(blob, { max: COVER_SHEET_WIDTH_IN_PX }),
              ),
            );

            const blobBuffers: Uint8Array<ArrayBuffer>[] = await Promise.all(
              scaledDownBlobs.map(applicationContext.convertBlobToUInt8Array),
            );

            response.scannedBuffer = blobBuffers;
            DWObject?.RemoveAllImages();
            return resolve(response);
          })
          .catch(err => {
            response.error = err;
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(response);
          })
          .finally(() => {
            DWObject?.UnregisterEvent('OnPostAllTransfers', onScanFinished);
          });
      };

      // called when ALL pages are finished
      const configureDWObject = () => {
        if (!DWObject) {
          return;
        }
        DWObject.RegisterEvent('OnPostAllTransfers', onScanFinished);

        DWObject.OpenSource();
        DWObject.IfDisableSourceAfterAcquire = true;
        DWObject.IfShowUI = false;
        DWObject.IfShowIndicator = false;
        DWObject.IfShowProgressBar = false;
        DWObject.Resolution = 300;
        DWObject.IfDuplexEnabled = duplexEnabled;
        DWObject.IfFeederEnabled = feederEnabled;
        DWObject.PixelType = (
          window as DynamsoftWindow
        ).Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB;
        DWObject.PageSize = (
          window as DynamsoftWindow
        ).Dynamsoft.DWT.EnumDWT_CapSupportedSizes.TWSS_A4;
      };
      configureDWObject();

      if (feederEnabled && !DWObject?.IfFeederLoaded) {
        DWObject?.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        return reject(new Error('no images in buffer'));
      }

      DWObject?.AcquireImage(
        () => {},
        e => {
          DWObject?.UnregisterEvent('OnPostAllTransfers', onScanFinished);
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          return reject(e);
        },
      );
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
