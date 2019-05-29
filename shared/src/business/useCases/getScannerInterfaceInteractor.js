exports.getScannerInterface = () => {
  const Dynamsoft = window.Dynamsoft;
  if (typeof Dynamsoft !== 'undefined') {
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    const DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');

    return {
      DWObject,
      changeSource: null,
      completeScanSession: async () => {
        const count = DWObject.HowManyImagesInBuffer;
        const promises = [];
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
              return blobBuffers;
            })
            .catch(err => {
              console.log('err', err);
            })
            .finally(() => {
              // store.set(state.isScanning, false);
              DWObject.RemoveAllImages();
              DWObject.CloseSource();
            });
        }
      },
      getScanCount: () => DWObject.HowManyImagesInBuffer,
      resourceUri:
        process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources', // clears the cached selected source and starts a scan session
      startScanSession: () => {
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
      },
    };
  }
};
