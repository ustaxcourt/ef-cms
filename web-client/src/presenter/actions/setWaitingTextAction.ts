import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the wait text on the spinner
 * @param {string} waitText the string to show on the spinner
 * @returns {object} the set waiting for response action
 */
export const setWaitingTextAction =
  waitText =>
  ({ store }: ActionProps) => {
    store.set(state.progressIndicator.waitText, waitText);
  };
