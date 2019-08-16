import { BaseModal } from './BaseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

export class ConfirmModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.title = this.props.title;
    this.confirmLabel = this.props.confirmLabel || 'Ok';
    this.cancelLabel = this.props.cancelLabel || 'Cancel';
    this.noConfirm = this.props.noConfirm;
    this.noCancel = this.props.noCancel;
    this.noCloseBtn = this.props.noCloseBtn;

    this.runCancelSequence = this.runCancelSequence.bind(this);
    this.runConfirmSequence = this.runConfirmSequence.bind(this);
  }

  runCancelSequence(event) {
    event.stopPropagation();
    if (this.props.onCancel) {
      this.props.onCancel.call();
    }
  }

  runConfirmSequence(event) {
    event.stopPropagation();
    if (this.props.onConfirm) {
      this.props.onConfirm.call();
    }
  }

  componentDidMount() {
    this.focusModal();
  }

  focusModal() {
    const modalHeader = document.querySelector(
      '.modal-header .modal-header__title',
    );
    modalHeader.focus();
  }

  render() {
    return (
      <BaseModal
        className={this.props.className}
        preventCancelOnBlur={this.props.preventCancelOnBlur}
        onBlurSequence={this.props.onCancelSequence}
      >
        <div className="modal-header grid-container padding-x-0">
          <div className="grid-row">
            <div
              className={classnames(
                this.noCloseBtn
                  ? 'mobile-lg:grid-col-12'
                  : 'mobile-lg:grid-col-9',
              )}
            >
              <h3 className="modal-header__title" tabIndex="-1">
                {this.title}
              </h3>
            </div>
            {!this.noCloseBtn && (
              <div className="mobile-lg:grid-col-3">
                <button
                  className="text-no-underline usa-button usa-button--unstyled hide-on-mobile float-right"
                  type="button"
                  onClick={this.runCancelSequence}
                >
                  Close{' '}
                  <FontAwesomeIcon className="margin-0" icon="times-circle" />
                </button>
              </div>
            )}
          </div>
        </div>
        {this.props.children}
        {(!this.noConfirm || !this.noCancel) && (
          <div className="button-box-container">
            {!this.noConfirm && (
              <button
                className="usa-button margin-right-205"
                type="button"
                onClick={this.runConfirmSequence}
              >
                {this.confirmLabel}
              </button>
            )}

            {!this.noCancel && (
              <button
                className="usa-button usa-button--outline"
                type="button"
                onClick={this.runCancelSequence}
              >
                {this.cancelLabel}
              </button>
            )}
          </div>
        )}
      </BaseModal>
    );
  }
}

ConfirmModalComponent.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  confirmLabel: PropTypes.string,
  noCancel: PropTypes.bool,
  noCloseBtn: PropTypes.bool,
  noConfirm: PropTypes.bool,
  onCancel: PropTypes.func,
  onCancelSequence: PropTypes.string,
  onConfirm: PropTypes.func,
  onConfirmSequence: PropTypes.string,
  preventCancelOnBlur: PropTypes.bool,
  title: PropTypes.string,
};

export const ConfirmModal = connect(
  {
    onCancel: sequences[props.onCancelSequence],
    onConfirm: sequences[props.onConfirmSequence],
  },
  ConfirmModalComponent,
);
