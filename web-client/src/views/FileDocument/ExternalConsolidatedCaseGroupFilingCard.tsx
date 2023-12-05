import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ExternalConsolidatedCaseGroupFilingCard = connect(
  {
    externalConsolidatedCaseGroupHelper:
      state.externalConsolidatedCaseGroupHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function ExternalConsolidatedCaseGroupFilingCard({
    externalConsolidatedCaseGroupHelper,
    form,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Which Cases Do You Want to File In?</h2>
        <div className="blue-container">
          <FormGroup errorText={validationErrors.fileAcrossConsolidatedGroup}>
            <fieldset
              className="usa-fieldset margin-bottom-0"
              id="consolidated-case-group-radios"
            >
              <legend
                className="with-hint"
                htmlFor="consolidated-case-group-radios"
                id="consolidated-case-group-radios-legend"
              >
                This case is part of a consolidated group.
              </legend>
              <span className="usa-hint">
                Select the group or this case to file in.
              </span>
              <input
                aria-describedby="consolidated-case-group-radios-legend"
                checked={form.fileAcrossConsolidatedGroup === true}
                className="usa-radio__input"
                id="consolidated-group-all"
                name="fileAcrossConsolidatedGroup"
                type="radio"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: true,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="consolidated-group-all"
              >
                All in the consolidated group
              </label>
              <ul className="ustc-unstyled-consolidated-case-list">
                {externalConsolidatedCaseGroupHelper.formattedConsolidatedCaseList.map(
                  (item, index) => (
                    <li className="margin-bottom-2" key={index}>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <input
                aria-describedby="consolidated-case-group-radios-legend"
                checked={form.fileAcrossConsolidatedGroup === false}
                className="usa-radio__input"
                id="consolidated-group-current-case"
                name="fileAcrossConsolidatedGroup"
                type="radio"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: false,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="consolidated-group-current-case"
              >
                {
                  externalConsolidatedCaseGroupHelper.formattedCurrentCasePetitionerNames
                }
              </label>
            </fieldset>
          </FormGroup>
        </div>
      </>
    );
  },
);

ExternalConsolidatedCaseGroupFilingCard.displayName =
  'ExternalConsolidatedCaseGroupFilingCard';
