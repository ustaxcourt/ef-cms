import { state } from 'cerebral';

/**
 * removes third-party scanner scripts from the DOM and sets associated state
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.scanner
 * @param {Function} providers.get the cerebral get helper function
 */

export const scannerShutdownAction = ({ get, store }) => {
  const dynanScriptClass = get(state.scanner.dynanScriptClass);
  if (dynanScriptClass) {
    const injectedScripts = Array.from(
      document.getElementsByClassName(dynanScriptClass),
    );
    injectedScripts.forEach(scriptEl => scriptEl.remove());
  }
  store.set(state.scanner.initiateScriptLoaded, false);
  store.set(state.scanner.configScriptLoaded, false);
};
