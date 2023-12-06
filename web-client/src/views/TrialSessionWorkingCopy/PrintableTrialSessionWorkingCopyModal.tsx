import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintableTrialSessionWorkingCopyModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.gotoPrintableTrialSessionWorkingCopySequence,
    showCaseNotes: state.modal.showCaseNotes,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function PrintableTrialSessionWorkingCopyModal({
    cancelSequence,
    confirmSequence,
    showCaseNotes,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="trial-session-planning-modal"
        confirmLabel="Print"
        confirmSequence={confirmSequence}
        title="Print Session Copy"
      >
        <div className="margin-bottom-4">
          <FormGroup>
            <fieldset
              className="usa-fieldset margin-bottom-0"
              id="case-notes-included-radios"
            >
              <legend className="display-block" id="case-notes-included-radios">
                Do you want to include your case notes in the printable session
                copy?
              </legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="irs-verified-notice-radios"
                  checked={showCaseNotes}
                  className="usa-radio__input"
                  id="caseNotesIncluded-yes"
                  name="showCaseNotes"
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
                  checked={!showCaseNotes}
                  className="usa-radio__input"
                  id="caseNotesIncluded-no"
                  name="showCaseNotes"
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

PrintableTrialSessionWorkingCopyModal.displayName =
  'PrintableTrialSessionWorkingCopyModal';
