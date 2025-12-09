import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { props } from 'cerebral';

type TextViewProps = {
  bind: string;
  className: string;
  get?: any
}

export const TextView: React.FC<TextViewProps> = connect({
  bind: props.bind,
  className: props`className`,
},function TextView(props) {
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

TextView.displayName = 'TextView';
