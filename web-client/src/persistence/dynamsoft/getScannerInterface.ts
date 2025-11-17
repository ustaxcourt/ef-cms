import { getConstants } from '@web-client/getConstants';
import { loadDWTLibrary } from './loader';
import type { WebTwain } from 'dwt/dist/types/WebTwain';
import Dynamsoft from 'dwt';

declare global {
  interface Window {
    Dynamsoft?: typeof Dynamsoft & {
      DWT: typeof Dynamsoft.DWT & {
        ScanDirectly: boolean;
      };
    };
  }
}

let DWObject: WebTwain | null = null;
let dynamsoftLoader: Promise<unknown> | null = null;

const getDwObjectOrThrow = (): WebTwain => {
  if (!DWObject) {
    throw new Error('Scanner interface has not been initialized.');
  }

  return DWObject;
};

export const getScannerInterface = () => {
  const completeScanSession = () => {
    const dwObject = getDwObjectOrThrow();
    dwObject.RemoveAllImages();
    dwObject.CloseSource();
    return Promise.resolve(true);
  };

  const getScanCount = () => getDwObjectOrThrow().HowManyImagesInBuffer;

  const getSources = () => {
    const dwObject = getDwObjectOrThrow();
    const count = dwObject.SourceCount;
    const sources: string[] = [];
    for (let i = 0; i < count; i++) {
      sources.push(dwObject.GetSourceNameItems(i));
    }
    return sources;
  };

  const getScanError = () => {
    const dwObject = getDwObjectOrThrow();
    return {
      code: dwObject.ErrorCode,
      message: dwObject.ErrorString,
    };
  };

  const loadDynamsoft = () => {
    if (!dynamsoftLoader) {
      // eslint-disable-next-line no-async-promise-executor
      dynamsoftLoader = new Promise(async resolve => {
        await loadDWTLibrary();
        const { Dynamsoft } = window;
        if (!Dynamsoft) {
          throw new Error('Dynamsoft library failed to load');
        }

        Dynamsoft.DWT.ResourcesPath = 'https://unpkg.com/dwt@latest/dist';
        Dynamsoft.DWT.ProductKey = getConstants().DYNAMSOFT_PRODUCT_KEYS ?? '';
        Dynamsoft.DWT.ScanDirectly = true;

        Dynamsoft.DWT.CreateDWTObject(
          'dwtcontrolContainer',
          function (object) {
            DWObject = object;
            resolve('dynam-scanner-injection');
          },
          function (exp) {
            console.error(exp);
          },
        );
      });
    }

    return dynamsoftLoader;
  };

  const getSourceStatus = () => {
    // 0	The Data Source is closed
    // 1	The Data Source is opened
    // 2	The Data Source is enabled
    // 3	The Data Source is acquiring images
    return getDwObjectOrThrow().DataSourceStatus;
  };

  const setSourceByIndex = (index: number) => {
    return getDwObjectOrThrow().SelectSourceByIndex(index);
  };

  const getSourceNameByIndex = (index: number) => {
    const sources = getSources();
    return sources[index];
  };

  const setSourceByName = (sourceName: string) => {
    const sources = getSources();
    const index = sources.indexOf(sourceName);
    if (index > -1) {
      return setSourceByIndex(index);
    } else {
      // Handle case where a named sources isn't found
      return false;
    }
  };

  const setDWObject = (dw: WebTwain) => {
    DWObject = dw;
    ret.DWObject = DWObject;
  };

  const startScanSession = ({ applicationContext, scanMode }) => {
    const dwObject = getDwObjectOrThrow();
    const { SCAN_MODES } = applicationContext.getConstants();
    const duplexEnabled = scanMode === SCAN_MODES.DUPLEX;
    const feederEnabled = scanMode !== SCAN_MODES.FLATBED;

    return new Promise((resolve, reject) => {
      const onScanFinished = () => {
        const count = dwObject.HowManyImagesInBuffer;
        if (count === 0) {
          reject(new Error('no images in buffer'));
          return;
        }
        const promises: Array<Promise<Blob>> = [];
        const response: {
          error: unknown;
          scannedBuffer: Uint8Array[] | null;
        } = { error: null, scannedBuffer: null };
        for (let index = 0; index < count; index++) {
          promises.push(
            new Promise<Blob>((resolveImage, rejectImage) => {
              dwObject.ConvertToBlob(
                [index],
                window.Dynamsoft!.DWT.EnumDWT_ImageType.IT_JPG,
                blob => resolveImage(blob),
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

            const blobBuffers: Uint8Array[] = await Promise.all(
              scaledDownBlobs.map(blob =>
                applicationContext.convertBlobToUInt8Array(blob),
              ),
            );

            response.scannedBuffer = blobBuffers;
            dwObject.RemoveAllImages();
            return resolve(response);
          })
          .catch(err => {
            response.error = err;
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(response);
          })
          .finally(() => {
            dwObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
          });
      };

      // called when ALL pages are finished
      dwObject.RegisterEvent('OnPostAllTransfers', onScanFinished);

      dwObject.OpenSource();
      dwObject.IfDisableSourceAfterAcquire = true;
      dwObject.IfShowUI = false;
      dwObject.IfShowIndicator = false;
      dwObject.IfShowProgressBar = false;
      dwObject.Resolution = 300;
      dwObject.IfDuplexEnabled = duplexEnabled;
      dwObject.IfFeederEnabled = feederEnabled;
      dwObject.PixelType = window.Dynamsoft!.DWT.EnumDWT_PixelType.TWPT_RGB;
      dwObject.PageSize =
        window.Dynamsoft!.DWT.EnumDWT_CapSupportedSizes.TWSS_A4;

      if (feederEnabled && !dwObject.IfFeederLoaded) {
        dwObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        return reject(new Error('no images in buffer'));
      }

      dwObject.AcquireImage(undefined, (errorCode, errorString) => {
        dwObject.UnregisterEvent('OnPostAllTransfers', onScanFinished);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return reject({ errorCode, errorString });
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
