import { state } from 'cerebral';

/**
 *
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const startScanAction = ({ store, get }) => {
  return new Promise((resolve, reject) => {
    let Dynamsoft = window.Dynamsoft;
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    store.set(state.isScanning, true);
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
