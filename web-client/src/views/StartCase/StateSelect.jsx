import React from 'react';

export const StateSelect = ({
  data,
  type,
  updateFormValueSequence,
  useFullStateName,
  usStates,
  validateStartCaseSequence,
}) => {
  return (
    <select
      className="usa-select"
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
      <optgroup label="Other">
        <option value="AA">AA</option>
        <option value="AE">AE</option>
        <option value="AP">AP</option>
        <option value="AS">AS</option>
        <option value="FM">FM</option>
        <option value="GU">GU</option>
        <option value="MH">MH</option>
        <option value="MP">MP</option>
        <option value="PW">PW</option>
        <option value="PR">PR</option>
        <option value="VI">VI</option>
      </optgroup>
    </select>
  );
};
