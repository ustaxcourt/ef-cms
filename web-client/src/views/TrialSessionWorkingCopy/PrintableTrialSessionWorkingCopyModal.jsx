import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrintableTrialSessionWorkingCopyModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseNotesFlag: state.modal.caseNotesFlag,
    confirmSequence: sequences.gotoPrintableTrialSessionWorkingCopySequence,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function PrintableTrialSessionWorkingCopyModal({
    cancelSequence,
    caseNotesFlag,
    confirmSequence,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Run Report"
        confirmSequence={confirmSequence}
        title="Run Printable Trial Session Copy"
      >
        <div className="margin-bottom-4">
          <FormGroup>
            <fieldset
              className="usa-fieldset margin-bottom-0"
              id="case-notes-included-radios"
            >
              <legend className="display-block" id="case-notes-included-radios">
                Do you want to include case notes in the printable session copy?
              </legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="irs-verified-notice-radios"
                  checked={caseNotesFlag === true}
                  className="usa-radio__input"
                  id="caseNotesIncluded-yes"
                  name="caseNotesFlag"
                  type="radio"
                  value={true}
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: true,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="caseNotesIncluded-yes"
                  id="case-notes-included-yes"
                >
                  Yes
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="irs-verified-notice-radios"
                  checked={caseNotesFlag === false}
                  className="usa-radio__input"
                  id="caseNotesIncluded-no"
                  name="caseNotesFlag"
                  type="radio"
                  value={false}
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: false,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="caseNotesIncluded-no"
                  id="case-notes-included-no"
                >
                  No
                </label>
              </div>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
