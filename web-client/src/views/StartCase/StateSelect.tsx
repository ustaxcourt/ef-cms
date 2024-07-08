import {
  US_STATES,
  US_STATES_OTHER,
} from '@shared/business/entities/EntityConstants';
import React from 'react';
import classNames from 'classnames';

export const StateSelect = ({
  className = '',
  data,
  handleBlur,
  handleChange,
  onChangeValidationSequence,
  refProp,
  type,
  useFullStateName,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}.state`}
      id={`${type}.state`}
      name={`${type}.state`}
      ref={refProp || undefined}
      value={data.state || (data[type] && data[type].state) || ''}
      onBlur={() => handleBlur && handleBlur()}
      onChange={e => {
        handleChange({
          key: e.target.name,
          value: e.target.value,
        });
        onChangeValidationSequence && onChangeValidationSequence();
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="State">
        {Object.keys(US_STATES).map(abbrev => {
          const label = useFullStateName ? US_STATES[abbrev] : abbrev;
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>
      <optgroup label="Other">
        {Object.keys(US_STATES_OTHER).map(abbrev => {
          const label = useFullStateName ? US_STATES_OTHER[abbrev] : abbrev;
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>
    </select>
  );
};

StateSelect.displayName = 'StateSelect';
