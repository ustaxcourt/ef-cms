import React from 'react';

export const PlaceOfLegalResidenceSelect = ({
  data,
  type,
  updateFormValueSequence,
  validateStartCaseSequence,
}) => {
  const legalResidenceOptions = ['State', 'Territory', 'Other'];
  return (
    <select
      className="usa-select"
      data-testid={`${type}.placeOfLegalResidence`}
      id={`${type}.placeOfLegalResidence`}
      name={`${type}.placeOfLegalResidence`}
      value={data[type].placeOfLegalResidence || ''}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: e.target.value,
        });
        validateStartCaseSequence();
      }}
    >
      <option value="">- Select -</option>
      <optgroup label="Place of legal residence">
        {legalResidenceOptions.map(lro => {
          return (
            <option key={lro} value={lro}>
              {lro}
            </option>
          );
        })}
      </optgroup>
    </select>
  );
};

PlaceOfLegalResidenceSelect.displayName = 'PlaceOfLegalResidenceSelect';
