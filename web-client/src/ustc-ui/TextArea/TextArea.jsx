import { FormGroup } from '../FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const TextArea = connect(props => {
  const { error, id, label, name, onChange } = props;
  const ariaLabelledby = props['aria-labelledby'];

  return (
    <FormGroup errorText={error}>
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-labelledby={ariaLabelledby}
        className={classNames('usa-textarea', error && 'usa-textarea--error')}
        id={id}
        name={name}
        onChange={onChange}
      />
    </FormGroup>
  );
});
