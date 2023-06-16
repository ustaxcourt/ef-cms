import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the serviceIndicator to Electronic
 * @param {string} key the key to use to bind to state
 * @returns {Function} the cerebral action
 */
export const setDefaultServiceIndicatorAction = key => {
  /**
   * @param {object} providers the providers object
   * @param {object} providers.applicationContext the application context
   * @param {object} providers.store the cerebral store used for setting the service indicator
   */
  return ({ applicationContext, props, store }: ActionProps) => {
    let serviceIndicator;

    if (props.defaultServiceIndicator) {
      serviceIndicator = props.defaultServiceIndicator;
    } else {
      const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
      serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    }

    store.set(state[key].serviceIndicator, serviceIndicator);
  };
};
