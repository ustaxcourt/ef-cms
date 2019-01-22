import { state } from 'cerebral';

export default ({ props, store }) => {
  let message = '';
  for (let key in props.errors) {
    if (props.errors.hasOwnProperty(key)) {
      message = message + props.errors[key] + ' ';
    }
  }

  const alertError = {
    alertError: {
      title: 'There is an error with this page.',
      message: message,
    },
  };
  store.set(state.alertError, alertError);
};
