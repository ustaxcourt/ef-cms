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
      if (key.indexOf('.')) {
        topLevelKey = key.split('.')[0];
      }
      if (props.errors[topLevelKey] !== undefined) {
        filteredErrorKeys.push(topLevelKey);
      }
    });
    return filteredErrorKeys;
  };

  if (props.errorDisplayOrder) {
    errorKeys = getErrorKeys(props.errorDisplayOrder);
  } else if (Array.isArray(fieldOrder) && fieldOrder.length) {
    errorKeys = getErrorKeys(fieldOrder);
  }

  const alertError = {
    messages: flattenDeep(
      errorKeys.map(key => {
        const error = props.errors[key];
        if (Array.isArray(error)) {
          return error.map(subError => {
            const subErrorKeys = Object.keys(subError).filter(
              key => key !== 'index',
            );
            return subErrorKeys.map(subErrorKey => {
              return `${key} #${subError.index + 1} - ${subErrorKey} field - ${
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
