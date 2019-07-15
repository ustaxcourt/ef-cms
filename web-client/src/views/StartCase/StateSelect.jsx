import PropTypes from 'prop-types';
import React from 'react';

export const StateSelect = ({
  data,
  type,
  updateFormValueSequence,
  useFullStateName,
  validateStartCaseSequence,
}) => {
  const usStates = {
    AK: 'Alaska',
    AL: 'Alabama',
    AR: 'Arkansas',
    AZ: 'Arizona',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DC: 'District of Columbia',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    IA: 'Iowa',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    MA: 'Massachusetts',
    MD: 'Maryland',
    ME: 'Maine',
    MI: 'Michigan',
    MN: 'Minnesota',
    MO: 'Missouri',
    MS: 'Mississippi',
    MT: 'Montana',
    NC: 'North Carolina',
    ND: 'North Dakota',
    NE: 'Nebraska',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NV: 'Nevada',
    NY: 'New York',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VA: 'Virginia',
    VT: 'Vermont',
    WA: 'Washington',
    WI: 'Wisconsin',
    WV: 'West Virginia',
    WY: 'Wyoming',
  };

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

StateSelect.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  updateFormValueSequence: PropTypes.func,
  useFullStateName: PropTypes.bool,
  validateStartCaseSequence: PropTypes.func,
};
