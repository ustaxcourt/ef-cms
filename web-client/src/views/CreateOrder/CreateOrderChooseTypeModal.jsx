import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { map } from 'lodash';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
          <div
            className={classNames(
              'usa-form-group',
              validationErrors.eventCode && 'usa-form-group--error',
            )}
          >
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
            {validationErrors.eventCode && (
              <div className="usa-error-message beneath">
                {validationErrors.eventCode}
              </div>
            )}
          </div>
          {form.eventCode == 'O' && (
            <div
              className={classNames(
                'usa-form-group',
                validationErrors.documentTitle && 'usa-form-group--error',
              )}
            >
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
              {validationErrors.documentTitle && (
                <div className="usa-error-message beneath">
                  {validationErrors.documentTitle}
                </div>
              )}
            </div>
          )}
        </div>
      </ModalDialog>
    );
  },
);
