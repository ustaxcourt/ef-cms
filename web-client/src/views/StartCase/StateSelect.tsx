import React from 'react';
import classNames from 'classnames';

export const StateSelect = ({
  className = '',
  data,
  onBlurSequence,
  onChangeValidationSequence,
  refProp,
  type,
  updateFormValueSequence,
  useFullStateName,
  usStates,
  usStatesOther,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}.state`}
      id={`${type}.state`}
      name={`${type}.state`}
      ref={refProp || undefined}
      value={data[type].state || ''}
      onBlur={() => onBlurSequence && onBlurSequence()}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
        onChangeValidationSequence && onChangeValidationSequence();
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="State">
        {Object.keys(usStates).map(abbrev => {
          const label = useFullStateName ? usStates[abbrev] : abbrev;
          return (
            <option key={abbrev} value={abbrev}>
              {label}
            </option>
          );
        })}
      </optgroup>
      <optgroup label="Other">
        {Object.keys(usStatesOther).map(abbrev => {
          const label = useFullStateName ? usStatesOther[abbrev] : abbrev;
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
