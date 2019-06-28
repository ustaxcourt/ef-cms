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
      title: 'Select Order Type',
    };
  }
  renderBody() {
    return (
      <div className="ustc-create-order-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.orderType
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor="orderType">
            Order Type
          </label>

          <select
            className="usa-select"
            id="orderType"
            name="orderType"
            onChange={e => {
              this.props.updateFormValue({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option value="">- Select -</option>
            {map(this.props.constants.ORDER_TYPES_MAP, (value, key) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          {this.props.validationErrors.orderType && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.orderType}
            </div>
          )}
        </div>
        {this.props.form.orderType == 'O' && (
          <div
            className={
              'usa-form-group ' +
              (this.props.validationErrors.orderTitle
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label className="usa-label" htmlFor="orderTitle">
              Add Message
            </label>
            <input
              className="usa-input"
              id="orderTitle"
              name="orderTitle"
              type="text"
              onChange={e => {
                this.props.updateFormValue({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            {this.props.validationErrors.orderTitle && (
              <div className="usa-error-message beneath">
                {this.props.validationErrors.orderTitle}
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
    confirmSequence: sequences.TBD, // TODO
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValue: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  CreateOrderChooseTypeModalComponent,
);
