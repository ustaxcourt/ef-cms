import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ConsolidatedCasesCheckboxes = connect(
  {
    consolidatedCaseAllCheckbox: state.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
  },
  function ConsolidatedCasesCheckboxes({
    consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange,
    formattedCaseDetail,
    updateCaseCheckbox,
  }) {
    return (
      <>
        <div className="usa-checkbox">
          <input
            checked={consolidatedCaseAllCheckbox}
            className="usa-checkbox__input"
            id="consolidated-case-checkbox-all"
            name="consolidated-case"
            type="checkbox"
            value="consolidated-case-checkbox-all"
            onChange={() => consolidatedCaseCheckboxAllChange()}
          />
          <label
            className="usa-checkbox__label"
            htmlFor="consolidated-case-checkbox-all"
          >
            All in the consolidated group
          </label>
        </div>

        {formattedCaseDetail.consolidatedCases.map(consolidatedCase => (
          <div
            className="usa-checkbox"
            key={consolidatedCase.docketNumber}
            title={consolidatedCase.tooltip}
          >
            <input
              checked={consolidatedCase.checked}
              className="usa-checkbox__input"
              disabled={consolidatedCase.checkboxDisabled}
              id={'consolidated-case-checkbox-' + consolidatedCase.docketNumber}
              name="consolidated-case"
              type="checkbox"
              value={consolidatedCase.docketNumber}
              onChange={event =>
                updateCaseCheckbox({
                  docketNumber: event.target.value,
                })
              }
            />
            <label
              className="usa-checkbox__label"
              htmlFor={
                'consolidated-case-checkbox-' + consolidatedCase.docketNumber
              }
            >
              {consolidatedCase.docketNumber}{' '}
              {consolidatedCase.formattedPetitioners}
            </label>
          </div>
        ))}
      </>
    );
  },
);
