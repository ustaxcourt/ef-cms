import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="trial-term">
                Do you want to include case notes in the printable working copy?
              </legend>
              <select
                aria-label="trial report term"
                className={classNames('usa-select')}
                name="caseNotesFlag"
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option selected key="Yes" value="true">
                  Yes
                </option>
                <option key="No" value="false">
                  No
                </option>
              </select>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
