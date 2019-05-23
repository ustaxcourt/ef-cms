import { state } from 'cerebral';

/**
 *
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const startScanAction = ({ props, store, get }) => {
  return new Promise((resolve, reject) => {
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    let DWObject = get(state.DWObject);

    if (!DWObject) {
      DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
      store.set(state.DWObject, DWObject);
    }

    if (DWObject) {
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
    }
  });
};
