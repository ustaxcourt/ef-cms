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
    modal: state.modal,
    orderTypesHelper: state.orderTypesHelper,
    updateModalValue: sequences.updateCreateOrderModalFormValueSequence,
    validateSequence: sequences.validateOrderWithoutBodySequence,
    validationErrors: state.validationErrors,
  },
  function CreateOrderChooseTypeModal({
    cancelSequence,
    confirmSequence,
    modal,
    orderTypesHelper,
    updateModalValue,
    validateSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelLink={true}
        cancelSequence={cancelSequence}
        confirmLabel="Continue"
        confirmSequence={confirmSequence}
        title="Create Order or Notice"
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
                updateModalValue({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence();
              }}
            >
              <option value="">- Select -</option>
              {map(
                orderTypesHelper.orderTypes,
                ({ documentType, eventCode }) => (
                  <option key={eventCode} value={eventCode}>
                    {documentType}
                  </option>
                ),
              )}
            </select>
          </FormGroup>
          {orderTypesHelper.showDocumentTitleInput && (
            <FormGroup errorText={validationErrors.documentTitle}>
              <label className="usa-label" htmlFor="documentTitle">
                {orderTypesHelper.documentTitleInputLabel}
              </label>
              <input
                className="usa-input"
                id="documentTitle"
                name="documentTitle"
                type="text"
                value={modal.documentTitle || ''}
                onChange={e => {
                  updateModalValue({
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
