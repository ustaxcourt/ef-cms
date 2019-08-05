import { flattenDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * runs through the props.errors and sets the state.alertError based on which fields failed validation which is used for
 * displaying a list of bullet point alerts in a red error alert at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for getting the props.errors
 * @param {object} providers.store the cerebral store used for setting state.alertError
 * @returns {undefined} doesn't return anything
 */
export const setFileDocumentValidationAlertErrorsAction = ({
  props,
  store,
}) => {
  let errorKeys = Object.keys(props.errors);
  if (props.errorDisplayOrder) {
    errorKeys = props.errorDisplayOrder.filter(
      key => props.errors[key] !== undefined,
    );
  }
  const alertError = {
    messages: flattenDeep(
      errorKeys.map(key => {
        const error = props.errors[key];
        if (Array.isArray(error)) {
          return error.map(subError => {
            let subErrorKeys = Object.keys(subError).filter(
              subKey => subKey !== 'index',
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
