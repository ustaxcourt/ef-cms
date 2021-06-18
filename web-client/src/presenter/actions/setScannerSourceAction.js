import { state } from 'cerebral';

/**
 * sets a scanner source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.props the cerebral props object used for getting the props.scannerSourceName
 * @param {Function} providers.store the cerebral store used for setting state.scanner.scannerSourceName
 * @returns {Promise} async action
 */
export const setScannerSourceAction = async ({
  applicationContext,
  props,
  store,
}) => {
  if (props.scannerSourceName) {
    const scanner = await applicationContext.getScanner();
    scanner.setSourceByName(props.scannerSourceName);

    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'scannerSourceName',
        value: props.scannerSourceName,
      });

    // also need to keep track of the index due to some scanners showing up twice as a source with duplicate name
    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'scannerSourceIndex',
        value: props.scannerSourceIndex,
      });

    await applicationContext
      .getUseCases()
      .setItemInteractor(applicationContext, {
        key: 'scanMode',
        value: props.scanMode,
      });

    // This may not be necessary
    store.set(state.scanner.scannerSourceName, props.scannerSourceName);
    store.set(state.scanner.scannerSourceIndex, props.scannerSourceIndex);
    store.set(state.scanner.scanMode, props.scanMode);
  } else {
    // you didn't pick a scanner source
  }
};
