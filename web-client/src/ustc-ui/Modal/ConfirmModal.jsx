import { BaseModal } from './BaseModal';
import { Button } from '../Button/Button';
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
                <Button
                  link
                  className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                  onClick={this.runCancelSequence}
                >
                  Close
                  <FontAwesomeIcon
                    className="margin-right-0 margin-left-1"
                    icon="times-circle"
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
        {this.props.children}
        {(!this.noConfirm || !this.noCancel) && (
          <>
            {!this.noConfirm && (
              <Button onClick={this.runConfirmSequence}>
                {this.confirmLabel}
              </Button>
            )}
            {!this.noCancel && (
              <Button secondary onClick={this.runCancelSequence}>
                {this.cancelLabel}
              </Button>
            )}
          </>
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
