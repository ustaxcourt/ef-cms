import { state } from 'cerebral';
import { flattenDeep } from 'lodash';

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

// var list = [];
// _.each(data, function(item) {
//   list.push(_.omit(item, 'children'));
//   list.push(_.flatten(_.pick(item, 'children')));
// });
// var result = _.flatten(list);
