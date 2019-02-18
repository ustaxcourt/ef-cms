import { state } from 'cerebral';
import { flattenDeep } from 'lodash';

export default ({ props, store }) => {
  const alertError = {
    title: 'Please correct the following errors on the page:',
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
        } else if (typeof error === 'object') {
          return Object.keys(error).map(k => error[k]);
        } else {
          return error;
        }
      }),
    ),
  };
  store.set(state.alertError, alertError);
};
