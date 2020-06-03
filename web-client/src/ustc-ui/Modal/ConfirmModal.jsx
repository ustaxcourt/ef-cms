import { BaseModal } from './BaseModal';
import { Button } from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const ConfirmModal = connect(
  {
    onCancel: sequences[props.onCancelSequence],
    onConfirm: sequences[props.onConfirmSequence],
    showModal: state.modal.showModal,
  },
  function ConfirmModal({
    cancelLabel,
    children,
    className,
    confirmLabel,
    displaySuccessBanner,
    hasErrorState,
    headerIcon,
    headerIconClassName,
    noCancel,
    noCloseBtn,
    noConfirm,
    onCancel,
    onCancelSequence,
    onConfirm,
    preventCancelOnBlur,
    showModal,
    showModalWhen,
    title,
  }) {
    hasErrorState = hasErrorState || false;
    headerIcon = headerIcon || null;
    headerIconClassName = headerIconClassName || '';
    confirmLabel = confirmLabel || 'Ok';
    cancelLabel = cancelLabel || 'Cancel';

    const runCancelSequence = event => {
      event.stopPropagation();
      onCancel?.call();
    };

    const runConfirmSequence = event => {
      event.stopPropagation();
      onConfirm?.call();
    };

    useEffect(() => {
      const focusModal = () => {
        const modalHeader = document.querySelector(
          '.modal-header .modal-header__title',
        );
        modalHeader && modalHeader.focus();
      };

      focusModal();
    }, []);

    if (showModalWhen && showModal !== showModalWhen) {
      return null;
    }

    return (
      <BaseModal
        className={classNames(className, hasErrorState && 'modal-error')}
        displaySuccessBanner={displaySuccessBanner}
        preventCancelOnBlur={preventCancelOnBlur}
        onBlurSequence={onCancelSequence}
      >
        <div className={classNames('modal-header grid-container padding-x-0')}>
          <div className="grid-row">
            <div
              className={classNames(
                noCloseBtn ? 'mobile-lg:grid-col-12' : 'mobile-lg:grid-col-9',
              )}
            >
              <h3 className="modal-header__title" tabIndex="-1">
                {headerIcon && (
                  <FontAwesomeIcon
                    className={headerIconClassName}
                    icon={headerIcon}
                    size="lg"
                  />
                )}{' '}
                {title}
              </h3>
            </div>
            {!noCloseBtn && (
              <div className="mobile-lg:grid-col-3">
                <Button
                  iconRight
                  link
                  className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                  icon="times-circle"
                  onClick={runCancelSequence}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="margin-bottom-2">{children}</div>
        {(!noConfirm || !noCancel) && (
          <div className="margin-top-5">
            {!noConfirm && (
              <Button id="confirm" onClick={runConfirmSequence}>
                {confirmLabel}
              </Button>
            )}
            {!noCancel && (
              <Button secondary onClick={runCancelSequence}>
                {cancelLabel}
              </Button>
            )}
          </div>
        )}
      </BaseModal>
    );
  },
);
