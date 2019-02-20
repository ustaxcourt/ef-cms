import { state } from 'cerebral';
import { flattenDeep } from 'lodash';

/**
 * runs through the props.errors and sets the state.alertError based on which fields failed validation which is used for
 * displaying a list of bullet point alerts in a red error alert at the top of the page.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object used for getting the props.errors
 * @param {Object} providers.store the cerebral store used for setting state.alertError
 * @returns {undefined} doesn't return anything
 */
export default ({ props, store }) => {
  const alertError = {
    title: 'There is an error with this page.',
    messages: flattenDeep(
      Object.keys(props.errors).map(key => {
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
        } else {
          return error;
        }
      }),
    ),
  };
  store.set(state.alertError, alertError);
};
