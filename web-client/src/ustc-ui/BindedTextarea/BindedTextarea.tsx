import { connect } from '@web-client/presenter/shared.cerebral';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../Utils/useCerebralState';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

type BindedTextareaProps = {
  bind?: string;
  onChange?: (value: any) => void;
  id?: string;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  name?: string;
  required?: boolean;
  maxLength?: number;
};

export const BindedTextarea: React.FC<BindedTextareaProps> = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props`bind`],
  },
  function BindedTextarea(componentProps: {
    bind: string;
    simpleSetter: Function;
    value: unknown;
    className?: string;
    onChange?: (value: string) => void;
    [key: string]: unknown;
  }) {
    const { bind, className, onChange, simpleSetter, value } = componentProps;

    let textValue, setText;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [textValue, setText] = useCerebralState(bind);
    } else {
      [textValue, setText] = useState();
    }

    setText = decorateWithPostCallback(setText, onChange);

    const prohibitedKeysOnTextarea = [
      'bind',
      'children',
      'get',
      'reaction',
      'simpleSetter',
    ];
    const textAreaProps = {
      ...componentProps,
      className: classNames(
        'usa-textarea',
        'textarea-resize-vertical',
        className,
      ),
      onChange: e => setText(e.target.value),
      value: textValue || '',
    };
    prohibitedKeysOnTextarea.forEach(attr => delete textAreaProps[attr]);

    return <textarea {...textAreaProps}></textarea>;
  },
);

BindedTextarea.displayName = 'BindedTextarea';
