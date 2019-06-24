import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export const If = connect(props => {
  const { bind, children, get } = props;

  let show = false;

  if (bind) {
    show = get(state[bind]);
  }

  if (show) {
    return children;
  }

  return null;
});
