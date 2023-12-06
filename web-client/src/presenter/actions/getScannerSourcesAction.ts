import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets scanner sources from TWAIN library
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.scanner.sources
 */
export const getScannerSourcesAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  const scanner = await applicationContext.getScanner();
  const sources = scanner.getSources();
  store.set(state.scanner.sources, sources);
};
