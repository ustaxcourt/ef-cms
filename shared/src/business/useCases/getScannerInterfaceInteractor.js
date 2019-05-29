exports.getScannerInterface = () => {
  const Dynamsoft = window.Dynamsoft;
  if (typeof Dynamsoft !== 'undefined') {
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    const DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');

    const completeScanSession = async () => {
      const count = DWObject.HowManyImagesInBuffer;
      const promises = [];
      const response = { error: null, scannerBuffer: null };

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

        return await Promise.all(promises)
          .then(async blobs => {
            const blobBuffers = [];

            for (let blob of blobs) {
              blobBuffers.push(
                new Uint8Array(await new Response(blob).arrayBuffer()),
              );
            }
            response.scannerBuffer = blobBuffers;
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
      }
    };

    const getScanCount = () => DWObject.HowManyImagesInBuffer;

    const startScanSession = () => {
      return new Promise((resolve, reject) => {
        DWObject.SelectSource(
          function() {
            DWObject.OpenSource();
            DWObject.IfDisableSourceAfterAcquire = true;
            DWObject.AcquireImage();
            resolve();
          },
          function() {
            console.log('SelectSource failed!');
            reject();
          },
        );
      });
    };

    return {
      DWObject,
      changeSource: null,
      completeScanSession,
      getScanCount,
      startScanSession,
    };
  }
};
