import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Text = connect(props => {
  const { bind, className, get } = props;

  let text;

  if (bind) {
    text = get(state[bind]);
  }

  if (!text) {
    return null;
  }

  return <span className={className}>{text}</span>;
});
