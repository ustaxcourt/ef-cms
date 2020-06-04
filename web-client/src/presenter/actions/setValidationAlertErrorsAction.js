import { flattenDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * runs through the props.errors and sets the state.alertError based on which fields failed validation which is used for
 * displaying a list of bullet point alerts in a red error alert at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object used for getting the props.errors
 * @param {object} providers.store the cerebral store used for setting state.alertError
 * @returns {undefined} doesn't return anything
 */
export const setValidationAlertErrorsAction = ({ get, props, store }) => {
  let errorKeys = Object.keys(props.errors);
  const fieldOrder = get(state.fieldOrder);

  const getErrorKeys = keys => {
    const filteredErrorKeys = [];
    keys.forEach(key => {
      let topLevelKey = key;
      if (key.includes('.')) {
        topLevelKey = key.split('.')[0];
      }
      if (props.errors[topLevelKey] !== undefined) {
        filteredErrorKeys.push(topLevelKey);
      }
    });

    // Since this only returns error keys provided in an ordered array, it's
    // possible something is missed. We should ensure all error messages get
    // returned, regardless of the order.
    let skippedKeys = [];

    if (filteredErrorKeys.length < errorKeys.length) {
      skippedKeys = errorKeys.filter(
        errorKey =>
          filteredErrorKeys.indexOf(errorKey) === -1 &&
          props.errors[errorKey] !== undefined,
      );
    }

    return filteredErrorKeys.concat(skippedKeys);
  };

  if (props.errorDisplayOrder) {
    errorKeys = getErrorKeys(props.errorDisplayOrder);
  } else if (Array.isArray(fieldOrder) && fieldOrder.length) {
    errorKeys = getErrorKeys(fieldOrder);
  }

  const alertError = {
    messages: flattenDeep(
      errorKeys
        .filter(key => props.errors[key] !== null)
        .map(key => {
          const error = props.errors[key];
          if (Array.isArray(error)) {
            return error.map(subError => {
              let subErrorKeys = Object.keys(subError).filter(
                k => k !== 'index',
              );
              if (props.errorDisplayOrder) {
                subErrorKeys = props.errorDisplayOrder.filter(
                  subKey => subError[subKey] !== undefined,
                );
              }
              let displayKey = key;
              if (props.errorDisplayMap) {
                displayKey = props.errorDisplayMap[key];
              }
              return subErrorKeys.map(subErrorKey => {
                return `${displayKey} #${subError.index + 1} - ${
                  subError[subErrorKey]
                }`;
              });
            });
          } else if (typeof error === 'object') {
            return Object.keys(error).map(k => error[k]);
          } else {
            return error;
          }
        }),
    ),
    title: 'Please correct the following errors on the page:',
  };
  store.set(state.alertError, alertError);
};
