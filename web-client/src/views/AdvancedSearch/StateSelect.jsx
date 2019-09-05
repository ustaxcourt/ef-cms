import { usStates } from '../StartCase/StateSelect';
import PropTypes from 'prop-types';
import React from 'react';

export const StateSelect = ({ bind, updateFormValueSequence }) => {
  return (
    <select
      className="usa-select"
      id="state"
      name="state"
      value={bind}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="State">
        {Object.keys(usStates).map(abbrev => {
          return (
            <option key={abbrev} value={abbrev}>
              {usStates[abbrev]}
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

StateSelect.propTypes = {
  bind: PropTypes.string,
  updateFormValueSequence: PropTypes.func,
};
