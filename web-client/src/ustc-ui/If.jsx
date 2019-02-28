import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(function If(props) {
  const { get, bind, children } = props;

  let show = false;

  if (bind) {
    show = get(state[bind]);
  }

  if (show) {
    return children;
  }

  return null;
});
