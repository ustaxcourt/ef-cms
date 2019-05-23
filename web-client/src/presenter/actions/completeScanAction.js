import { state } from 'cerebral';

/**
 * sets the state.path based on the props.path passed in
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const completeScanAction = ({
  props,
  store,
  get,
  applicationContext,
}) => {
  const DWObject = get(state.DWObject);
  const count = DWObject.HowManyImagesInBuffer;
  const promises = [];
  for (let index = 0; index < count; index++) {
    promises.push(
      new Promise((resolve, reject) => {
        DWObject.ConvertToBlob(
          [index],
          window['EnumDWT_ImageType'].IT_PNG,
          data => {
            console.log('we are here', data);
            resolve(data);
          },
          reject,
        );
      }),
    );
  }
  Promise.all(promises)
    .then(async blobs => {
      const blobBuffers = [];

      for (let blob of blobs) {
        blobBuffers.push(
          new Uint8Array(await new Response(blob).arrayBuffer()),
        );
      }

      const pdfBlob = applicationContext
        .getUseCases()
        .generatePDFFromPNGData(blobBuffers);

      const pdfFile = new File([pdfBlob], 'myfile.pdf');

      props.onComplete(pdfFile);
    })
    .catch(err => {
      console.log('err', err);
    })
    .finally();
};
