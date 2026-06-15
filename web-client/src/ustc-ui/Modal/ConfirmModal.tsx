import { BaseModal } from './BaseModal';
import { Button } from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

type ConfirmModalProps = {
  cancelLabel?: string;
  children?: React.ReactNode;
  className?: string;
  confirmLabel?: string;
  deleteLabel?: string;
  disableTooltip?: boolean;
  hasErrorState?: boolean;
  headerIcon?: IconProp;
  headerIconClassName?: string;
  noCancel?: boolean;
  noCloseBtn?: boolean;
  noConfirm?: boolean;
  onCancelSequence: Function;
  onConfirmSequence: Function;
  onDeleteSequence?: Function;
  showDelete?: boolean;
  showModalWhen?: string;
  title: string;
  useLinkForCancel?: boolean;
};

const confirmModalDeps = {
  showModal: state.modal.showModal,
  waitingForResponse: state.progressIndicator.waitingForResponse,
};

export const ConfirmModal = connect<ConfirmModalProps, typeof confirmModalDeps>(
  confirmModalDeps,
  function ConfirmModal({
    cancelLabel = 'Cancel',
    useLinkForCancel = false,
    children,
    className,
    confirmLabel = 'Ok',
    deleteLabel = 'Delete',
    disableTooltip = false,
    hasErrorState = false,
    headerIcon,
    headerIconClassName = '',
    noCancel,
    noCloseBtn,
    noConfirm,
    onCancelSequence,
    onConfirmSequence,
    onDeleteSequence,
    showDelete = false,
    showModal,
    showModalWhen,
    title,
    waitingForResponse,
  }) {
    useEffect(() => {
      const focusModal = () => {
        const modalHeader = window.document.querySelector(
          '.modal-header .modal-header__title',
        ) as HTMLElement | null;
        modalHeader?.focus();
      };

      focusModal();
    }, []);

    if (showModalWhen && showModal !== showModalWhen) {
      return null;
    }

    return (
      <BaseModal
        className={classNames(className, hasErrorState && 'modal-error')}
        {...(!disableTooltip && { title })}
      >
        <div className={classNames('modal-header grid-container padding-x-0')}>
          <div className="grid-row">
            <div
              className={classNames(
                noCloseBtn ? 'mobile-lg:grid-col-12' : 'mobile-lg:grid-col-9',
              )}
            >
              <h3
                className="modal-header__title"
                data-testid="confirm-modal-header"
                tabIndex={-1}
              >
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
                  data-testid="confirm-modal-close-btn"
                  iconRight
                  link
                  className="text-no-underline hide-on-mobile float-right margin-right-0 padding-top-0"
                  icon="times-circle"
                  onClick={event => {
                    event.stopPropagation();
                    onCancelSequence();
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="margin-bottom-2">{children}</div>
        {(!noConfirm || !noCancel || showDelete) && (
          <div className="margin-top-5">
            {!noConfirm && (
              <Button
                data-testid="modal-confirm"
                disabled={waitingForResponse}
                id="confirm"
                onClick={event => {
                  event.stopPropagation();
                  onConfirmSequence();
                }}
              >
                {confirmLabel}
              </Button>
            )}
            {!noCancel && (
              <Button
                data-testid="confirm-modal-cancel-btn"
                secondary
                link={useLinkForCancel}
                className={classNames(
                  useLinkForCancel ? 'text-no-underline' : '',
                )}
                id="cancel"
                onClick={event => {
                  event.stopPropagation();
                  onCancelSequence();
                }}
              >
                {cancelLabel}
              </Button>
            )}
            {showDelete && (
              <Button
                link
                className="red-warning float-right no-wrap"
                icon="trash"
                id="confirm-modal-delete-btn"
                onClick={event => {
                  event.stopPropagation();
                  if (onDeleteSequence) onDeleteSequence();
                }}
              >
                {deleteLabel}
              </Button>
            )}
          </div>
        )}
      </BaseModal>
    );
  },
);

ConfirmModal.displayName = 'ConfirmModal';
