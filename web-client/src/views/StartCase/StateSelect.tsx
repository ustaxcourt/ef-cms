import React from 'react';
import classNames from 'classnames';

export const StateSelect = ({
  className = '',
  data,
  type,
  updateFormValueSequence,
  useFullStateName,
  usStates,
  usStatesOther,
  validateStartCaseSequence,
}) => {
  return (
    <select
      className={className ? classNames(className, 'usa-select') : 'usa-select'}
      data-testid={`${type}.state`}
      id={`${type}.state`}
      name={`${type}.state`}
      value={data[type].state || ''}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
        validateStartCaseSequence();
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
      <optgroup label="Territory">
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
