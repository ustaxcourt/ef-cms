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
    showModal: state.showModal,
  },
  ({
    cancelLabel,
    children,
    className,
    confirmLabel,
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
  }) => {
    hasErrorState = hasErrorState || true;
    headerIcon = headerIcon || null;
    headerIconClassName = headerIconClassName || '';
    confirmLabel = confirmLabel || 'Ok';
    cancelLabel = cancelLabel || 'Cancel';

    const runCancelSequence = event => {
      event.stopPropagation();
      if (onCancel) {
        onCancel.call();
      }
    };

    const runConfirmSequence = event => {
      event.stopPropagation();
      if (onConfirm) {
        onConfirm.call();
      }
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
                  link
                  className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                  onClick={runCancelSequence}
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
        <div className="margin-bottom-2">{children}</div>
        {(!noConfirm || !noCancel) && (
          <>
            {!noConfirm && (
              <Button onClick={runConfirmSequence}>{confirmLabel}</Button>
            )}
            {!noCancel && (
              <Button secondary onClick={runCancelSequence}>
                {cancelLabel}
              </Button>
            )}
          </>
        )}
      </BaseModal>
    );
  },
);
