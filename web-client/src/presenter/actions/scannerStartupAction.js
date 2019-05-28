import { state } from 'cerebral';

/**
 * injects third-party scanner scripts into the DOM and sets associated state
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.scanner
 */

export const scannerStartupAction = async ({ store }) => {
  const dynanScriptClass = 'dynam-scanner-injection';

  // Create a script element to inject into the header
  const script1 = document.createElement('script');
  script1.type = 'text/javascript';
  script1.async = true;
  script1.setAttribute('class', dynanScriptClass);

  // Set a reference so we can remove later
  store.set(state.scanner.dynanScriptClass, dynanScriptClass);

  // Reduce duplicating the above code
  const script2 = script1.cloneNode();

  script1.onload = function() {
    store.set(state.scanner.initiateScriptLoaded, true);
  };

  script2.onload = function() {
    store.set(state.scanner.configScriptLoaded, true);
  };

  // Should be based on the env
  script1.src =
    'http://localhost:10000/Resources/dynamsoft.webtwain.initiate.js';
  script2.src = 'http://localhost:10000/Resources/dynamsoft.webtwain.config.js';

  // Inject scripts into <head />
  document.getElementsByTagName('head')[0].appendChild(script1);
  document.getElementsByTagName('head')[0].appendChild(script2);
};
