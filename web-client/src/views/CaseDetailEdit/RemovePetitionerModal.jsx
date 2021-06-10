import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RemovePetitionerModal = connect(
  {
    cancelRemovePetitionerSequence: sequences.cancelRemovePetitionerSequence,
    confirmSequence: sequences.removePetitionerAndUpdateCaptionSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    newStatus: state.constants.STATUS_TYPES.new,
    updateCaseModalHelper: state.updateCaseModalHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateUpdateCaseModalSequence: sequences.validateUpdateCaseModalSequence,
    validationErrors: state.validationErrors,
  },
  function RemovePetitionerModal({
    cancelRemovePetitionerSequence,
    confirmSequence,
    constants,
    form,
    modal,
    updateModalValueSequence,
    validateUpdateCaseModalSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={() =>
          cancelRemovePetitionerSequence({
            contactType: form.contact.contactType,
          })
        }
        confirmLabel="Yes, Remove"
        confirmSequence={confirmSequence}
        title="Remove Petitioner and Update Caption"
      >
        <div className="margin-bottom-2" id="remove-petitioner-modal">
          <WarningNotificationComponent
            alertWarning={{
              title: `Are you sure you want to remove ${form.contact.name} from this case?`,
            }}
            dismissable={false}
            scrollToTop={false}
          />
          <FormGroup errorText={validationErrors.caseCaption}>
            <label className="usa-label" htmlFor="caption">
              Case caption
            </label>
            <textarea
              aria-labelledby="caption-label"
              className="caption usa-textarea"
              id="caption"
              name="caseCaption"
              value={modal.caseCaption}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateUpdateCaseModalSequence();
              }}
            />
            <span className="display-inline-block margin-top-1">
              {constants.CASE_CAPTION_POSTFIX}
            </span>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
