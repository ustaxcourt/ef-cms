import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { map } from 'lodash';
import { sequences, state } from 'cerebral';
import React from 'react';

class CreateOrderChooseTypeModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Continue',
      title: 'Create Order',
    };
  }
  renderBody() {
    return (
      <div className="ustc-create-order-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.eventCode
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor="eventCode">
            Select order type
          </label>

          <select
            className="usa-select"
            id="eventCode"
            name="eventCode"
            onChange={e => {
              this.props.updateFormValue({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.validateSequence();
            }}
          >
            <option value="">- Select -</option>
            {map(
              this.props.constants.ORDER_TYPES_MAP,
              ({ documentType, eventCode }) => (
                <option key={eventCode} value={eventCode}>
                  {documentType}
                </option>
              ),
            )}
          </select>
          {this.props.validationErrors.eventCode && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.eventCode}
            </div>
          )}
        </div>
        {this.props.form.eventCode == 'O' && (
          <div
            className={
              'usa-form-group ' +
              (this.props.validationErrors.documentTitle
                ? 'usa-form-group--error'
                : '')
            }
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
                this.props.updateFormValue({
                  key: e.target.name,
                  value: e.target.value,
                });
                this.props.validateSequence();
              }}
            />
            {this.props.validationErrors.documentTitle && (
              <div className="usa-error-message beneath">
                {this.props.validationErrors.documentTitle}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export const CreateOrderChooseTypeModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitCreateOrderModalSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValue: sequences.updateCreateOrderModalFormValueSequence,
    validateSequence: sequences.validateOrderWithoutBodySequence,
    validationErrors: state.validationErrors,
  },
  CreateOrderChooseTypeModalComponent,
);
