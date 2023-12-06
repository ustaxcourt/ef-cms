// This is fine.

import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

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
