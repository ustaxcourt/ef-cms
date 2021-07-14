const { image1, image2 } = require('../../business/useCases/scannerMockFiles');

let scanBuffer = [];

const DWObject = {
  AcquireImage: () => {
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    scanBuffer.push(b64toBlob(image1, 'image/jpeg'));
    scanBuffer.push(b64toBlob(image2, 'image/jpeg'));
    DWObject.HowManyImagesInBuffer += 2;
  },
  CloseSource: () => null,
  ConvertToBlob: (indicies, type, resolve) => {
    const blob = scanBuffer[indicies[0]];
    resolve(blob);
  },
  DataSourceStatus: null,
  ErrorCode: null,
  ErrorString: null,
  HowManyImagesInBuffer: 0,
  OpenSource: () => null,
  RemoveAllImages: () => {
    scanBuffer = [];
    DWObject.HowManyImagesInBuffer = 0;
  },
  SelectSourceByIndex: () => null,
};

exports.getScannerInterface = () => {
  const completeScanSession = async () => {
    DWObject.RemoveAllImages();
    DWObject.CloseSource();
  };

  const getScanCount = () => DWObject.HowManyImagesInBuffer;

  const loadDynamsoft = () => {
    return 'noop';
  };

  const getSources = () => {
    return ['scanner A', 'scanner B'];
  };

  const getScanError = () => {
    return {
      code: DWObject.ErrorCode,
      message: DWObject.ErrorString,
    };
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

  const startScanSession = ({ applicationContext, scanMode }) => {
    const { SCAN_MODES } = applicationContext.getConstants();
    DWObject.IfDisableSourceAfterAcquire = true;
    DWObject.IfDuplexEnabled = scanMode === SCAN_MODES.DUPLEX;
    DWObject.IfFeederEnabled = scanMode !== SCAN_MODES.FLATBED;
    DWObject.OpenSource();
    DWObject.AcquireImage();

    const count = DWObject.HowManyImagesInBuffer;
    const promises = [];
    const response = { error: null, scannedBuffer: null };
    for (let index = 0; index < count; index++) {
      promises.push(
        new Promise((resolve, reject) => {
          DWObject.ConvertToBlob([index], null, resolve, reject);
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
        return response;
      })
      .catch(err => {
        response.error = err;
        return response;
      });
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
};
