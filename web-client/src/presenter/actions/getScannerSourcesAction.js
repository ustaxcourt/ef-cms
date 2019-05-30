import { state } from 'cerebral';

/**
 * gets scanner sources from TWAIN library
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.scanner.sources
 */
export const setScannerSourceAction = async ({ applicationContext, store }) => {
  const scanner = applicationContext.getScanner();
  const sources = scanner.getSources();
  store.set(state.scanner.sources, sources);
};
