import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ConsolidatedCasesCheckboxes = connect(
  {
    consolidatedCaseAllCheckbox: state.modal.form.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    consolidatedCasesToMultiDocketOn:
      state.modal.form.consolidatedCasesToMultiDocketOn,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
  },
  function ConsolidatedCasesCheckboxes({
    consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange,
    consolidatedCasesToMultiDocketOn,
    updateCaseCheckbox,
  }) {
    return (
      <>
        <div className="usa-checkbox">
          <input
            checked={consolidatedCaseAllCheckbox}
            className="usa-checkbox__input"
            data-testid="consolidated-case-checkbox-all"
            id="consolidated-case-checkbox-all"
            name="consolidated-case"
            type="checkbox"
            value="consolidated-case-checkbox-all"
            onChange={() => consolidatedCaseCheckboxAllChange()}
          />
          <label
            className="usa-checkbox__label"
            data-testid="consolidated-case-checkbox-all-label"
            htmlFor="consolidated-case-checkbox-all"
          >
            All in the consolidated group
          </label>
        </div>

        {consolidatedCasesToMultiDocketOn.map(consolidatedCase => (
          <div
            className="usa-checkbox"
            key={consolidatedCase.docketNumber}
            title={consolidatedCase.tooltip}
          >
            <input
              checked={consolidatedCase.checked}
              className="usa-checkbox__input"
              data-testid={`consolidated-case-checkbox-${consolidatedCase.docketNumber}`}
              disabled={consolidatedCase.checkboxDisabled}
              id={`consolidated-case-checkbox-${consolidatedCase.docketNumber}`}
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
              data-testid={`consolidated-case-checkbox-${consolidatedCase.docketNumber}-label`}
              htmlFor={`consolidated-case-checkbox-${consolidatedCase.docketNumber}`}
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

ConsolidatedCasesCheckboxes.displayName = 'ConsolidatedCasesCheckboxes';
