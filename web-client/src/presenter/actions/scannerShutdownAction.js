import { state } from 'cerebral';

export const scannerShutdownAction = ({ store, get }) => {
  const dynanScriptClass = get(state.scanner.dynanScriptClass);
  if (dynanScriptClass) {
    const injectedScripts = Array.from(
      document.getElementsByClassName(dynanScriptClass),
    );
    injectedScripts.map(scriptEl => scriptEl.remove());
  }
  store.set(state.scanner.initiateScriptLoaded, false);
  store.set(state.scanner.configScriptLoaded, false);
};
