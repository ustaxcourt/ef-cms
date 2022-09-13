import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PrintableTrialSessionWorkingCopyModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.gotoPrintableTrialSessionWorkingCopySequence,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function PrintableTrialSessionWorkingCopyModal({
    cancelSequence,
    confirmSequence,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Run Copy"
        confirmSequence={confirmSequence}
        title="Run Printable Trial Session Working Copy"
      >
        <div className="margin-bottom-4">
          <FormGroup>
            <fieldset
              className="usa-fieldset margin-bottom-0"
              id="case-notes-included-radios"
            >
              <legend className="display-block" id="case-notes-included-radios">
                Do you want to include case notes in the printable working copy?
              </legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked
                  aria-describedby="irs-verified-notice-radios"
                  className="usa-radio__input"
                  id="caseNotesIncluded-yes"
                  name="caseNotesFlag"
                  type="radio"
                  value={true}
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: e.target.value,
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
                  className="usa-radio__input"
                  id="caseNotesIncluded-no"
                  name="caseNotesFlag"
                  type="radio"
                  value={false}
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: e.target.value,
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
