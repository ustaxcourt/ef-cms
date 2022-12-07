// This is fine.
import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export const If = connect(function If(props) {
  const { bind, children, get, not } = props;

  let show = false;

  if (bind) {
    show = get(state[bind]);
  }

  if (!!show ^ !!not) {
    return children;
  }

  return null;
});

If.displayName = 'If';
