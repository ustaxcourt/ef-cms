import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { map } from 'lodash';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateOrderChooseTypeModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitCreateOrderModalSequence,
    constants: state.constants,
    form: state.form,
    updateFormValue: sequences.updateCreateOrderModalFormValueSequence,
    validateSequence: sequences.validateOrderWithoutBodySequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    constants,
    form,
    updateFormValue,
    validateSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Continue"
        confirmSequence={confirmSequence}
        title="Create Order"
      >
        <div className="ustc-create-order-modal">
          <FormGroup errorText={validationErrors.eventCode}>
            <label className="usa-label" htmlFor="eventCode">
              Select order type
            </label>

            <select
              className="usa-select"
              id="eventCode"
              name="eventCode"
              onChange={e => {
                updateFormValue({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence();
              }}
            >
              <option value="">- Select -</option>
              {map(constants.ORDER_TYPES_MAP, ({ documentType, eventCode }) => (
                <option key={eventCode} value={eventCode}>
                  {documentType}
                </option>
              ))}
            </select>
          </FormGroup>
          {form.eventCode == 'O' && (
            <FormGroup errorText={validationErrors.documentTitle}>
              <label className="usa-label" htmlFor="documentTitle">
                Order title
              </label>
              <input
                className="usa-input"
                id="documentTitle"
                name="documentTitle"
                type="text"
                onChange={e => {
                  updateFormValue({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSequence();
                }}
              />
            </FormGroup>
          )}
        </div>
      </ModalDialog>
    );
  },
);
