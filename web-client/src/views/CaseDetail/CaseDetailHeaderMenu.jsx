import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddToTrialModal } from './AddToTrialModal';
import { BlockFromTrialModal } from './BlockFromTrialModal';
import { CreateCaseDeadlineModalDialog } from './CreateCaseDeadlineModalDialog';
import { CreateMessageModalDialog } from '../Messages/CreateMessageModalDialog';
import { CreateOrderChooseTypeModal } from '../CreateOrder/CreateOrderChooseTypeModal';
import { DeleteCaseDeadlineModalDialog } from './DeleteCaseDeadlineModalDialog';
import { EditCaseDeadlineModalDialog } from './EditCaseDeadlineModalDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { PrioritizeCaseModal } from './PrioritizeCaseModal';
import { RemoveFromTrialSessionModal } from './RemoveFromTrialSessionModal';
import { UnblockFromTrialModal } from './UnblockFromTrialModal';
import { UnprioritizeCaseModal } from './UnprioritizeCaseModal';
import { UpdateCaseModalDialog } from '../CaseDetailEdit/UpdateCaseModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const CaseDetailHeaderMenu = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    isCaseDetailMenuOpen: state.menuHelper.isCaseDetailMenuOpen,
    navigateToPathSequence: sequences.navigateToPathSequence,
    openAddEditCaseNoteModalSequence:
      sequences.openAddEditCaseNoteModalSequence,
    openCaseInNewTabSequence: sequences.openCaseInNewTabSequence,
    openCreateCaseDeadlineModalSequence:
      sequences.openCreateCaseDeadlineModalSequence,
    openCreateMessageModalSequence: sequences.openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence: sequences.openUpdateCaseModalSequence,
    resetCaseMenuSequence: sequences.resetCaseMenuSequence,
    showModal: state.modal.showModal,
    toggleMenuSequence: sequences.toggleMenuSequence,
  },
  function CaseDetailHeaderMenu({
    caseDetail,
    caseDetailHeaderHelper,
    isCaseDetailMenuOpen,
    navigateToPathSequence,
    openAddEditCaseNoteModalSequence,
    openCaseInNewTabSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    resetCaseMenuSequence,
    showModal,
    toggleMenuSequence,
  }) {
    const menuRef = useRef(null);
    const keydown = event => {
      const pressedESC = event.keyCode === 27;
      if (pressedESC) {
        return resetCaseMenuSequence();
      }
    };

    const reset = e => {
      const clickedWithinComponent = menuRef.current.contains(e.target);
      const clickedOnMenuButton = e.target.closest('.usa-accordion__button');
      const clickedOnSubNav = e.target.closest('.usa-nav__primary-item');
      if (!clickedWithinComponent) {
        return resetCaseMenuSequence();
      } else if (!clickedOnMenuButton && !clickedOnSubNav) {
        return resetCaseMenuSequence();
      }
      return true;
    };

    useEffect(() => {
      document.addEventListener('mousedown', reset, false);
      document.addEventListener('keydown', keydown, false);
      return () => {
        resetCaseMenuSequence();
        document.removeEventListener('mousedown', reset, false);
        document.removeEventListener('keydown', keydown, false);
      };
    }, []);

    return (
      <div className="tablet:grid-col-1" ref={menuRef}>
        <ul className="usa-nav__primary usa-accordion case-detail-menu flex-column flex-align-end">
          <li
            className={classNames(
              'usa-nav__primary-item',
              isCaseDetailMenuOpen && 'usa-nav__submenu--open',
            )}
          >
            <button
              aria-expanded={isCaseDetailMenuOpen}
              className="usa-accordion__button usa-nav__link hidden-underline case-detail-menu__button text-no-wrap"
              id="case-detail-menu-button"
              onClick={() => {
                toggleMenuSequence({ caseDetailMenu: 'CaseDetailMenu' });
              }}
            >
              Create
              <FontAwesomeIcon
                className="margin-left-05"
                icon={isCaseDetailMenuOpen ? 'caret-up' : 'caret-down'}
                size="1x"
              />
            </button>

            {isCaseDetailMenuOpen && (
              <ul className="usa-nav__submenu position-right-0">
                <li
                  className="usa-nav__submenu-item row-button"
                  id="menu-button-new-tab"
                  onClick={() => {
                    resetCaseMenuSequence();
                    openCaseInNewTabSequence();
                  }}
                >
                  <Icon
                    aria-label="create message"
                    className="margin-right-1"
                    icon="arrow-right"
                    size="1x"
                  />
                  New Tab
                  <hr></hr>
                </li>

                <li
                  className="usa-nav__submenu-item row-button"
                  id="menu-button-add-new-message"
                  onClick={() => {
                    resetCaseMenuSequence();
                    openCreateMessageModalSequence();
                  }}
                >
                  <Icon
                    aria-label="create message"
                    className="margin-right-1"
                    icon="envelope"
                    size="1x"
                  />
                  Message
                  <hr></hr>
                </li>
                <li
                  className="usa-nav__submenu-item row-button"
                  id="menu-button-add-deadline"
                  onClick={() => {
                    resetCaseMenuSequence();
                    openCreateCaseDeadlineModalSequence();
                  }}
                >
                  <Icon
                    aria-label="create deadline"
                    className="margin-right-1"
                    icon="calendar-alt"
                    size="1x"
                  />
                  Deadline
                  <hr></hr>
                </li>

                {caseDetailHeaderHelper.showCreateOrderButton && (
                  <li
                    className="usa-nav__submenu-item row-button"
                    id="menu-button-create-order"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openCreateOrderChooseTypeModalSequence();
                    }}
                  >
                    <Icon
                      aria-label="create order or notice"
                      className="margin-right-1"
                      icon="clipboard-list"
                      size="1x"
                    />
                    Order or Notice
                    <hr></hr>
                  </li>
                )}
                {caseDetailHeaderHelper.showAddDocketEntryButton && (
                  <li
                    className="usa-nav__submenu-item row-button"
                    id="menu-button-add-docket-entry"
                    onClick={() => {
                      navigateToPathSequence({
                        path: `/case-detail/${caseDetail.docketNumber}/add-paper-filing`,
                      });
                    }}
                  >
                    <Icon
                      aria-label="create paper filing"
                      className="margin-right-1"
                      icon="plus-circle"
                      size="1x"
                    />
                    Paper Filing
                    <hr></hr>
                  </li>
                )}

                {caseDetailHeaderHelper.showUploadCourtIssuedDocumentButton && (
                  <li
                    className="usa-nav__submenu-item row-button"
                    id="menu-button-upload-pdf"
                    onClick={() => {
                      navigateToPathSequence({
                        path: `/case-detail/${caseDetail.docketNumber}/upload-court-issued`,
                      });
                    }}
                  >
                    <Icon
                      aria-label="create pdf upload"
                      className="margin-right-1 fa-icon-blue"
                      icon="file-pdf"
                      size="1x"
                    />
                    PDF Upload
                    <hr></hr>
                  </li>
                )}

                {caseDetailHeaderHelper.showAddCorrespondenceButton && (
                  <li
                    className="usa-nav__submenu-item row-button"
                    id="menu-button-upload-pdf"
                    onClick={() => {
                      navigateToPathSequence({
                        path: `/case-detail/${caseDetail.docketNumber}/upload-correspondence`,
                      });
                    }}
                  >
                    <Icon
                      aria-label="create pdf upload"
                      className="margin-right-1 fa-icon-blue"
                      icon="mail-bulk"
                      size="1x"
                    />
                    Correspondence
                    <hr></hr>
                  </li>
                )}

                <li
                  className="usa-nav__submenu-item row-button"
                  id="menu-add-case-note-button"
                  onClick={() => {
                    resetCaseMenuSequence();
                    openAddEditCaseNoteModalSequence();
                  }}
                >
                  <Icon
                    aria-label="create order or notice"
                    className="margin-right-1"
                    icon="sticky-note"
                    size="1x"
                  />
                  Case Note
                </li>
              </ul>
            )}
          </li>
        </ul>
        {showModal === 'CreateCaseDeadlineModalDialog' && (
          <CreateCaseDeadlineModalDialog />
        )}
        {showModal === 'EditCaseDeadlineModalDialog' && (
          <EditCaseDeadlineModalDialog />
        )}
        {showModal === 'DeleteCaseDeadlineModalDialog' && (
          <DeleteCaseDeadlineModalDialog />
        )}
        {showModal === 'AddEditCaseNoteModal' && (
          <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteSequence" />
        )}
        {showModal === 'AddToTrialModal' && <AddToTrialModal />}
        {showModal === 'BlockFromTrialModal' && <BlockFromTrialModal />}
        {showModal === 'UnblockFromTrialModal' && <UnblockFromTrialModal />}
        {showModal === 'PrioritizeCaseModal' && <PrioritizeCaseModal />}
        {showModal === 'UnprioritizeCaseModal' && <UnprioritizeCaseModal />}
        {showModal === 'RemoveFromTrialSessionModal' && (
          <RemoveFromTrialSessionModal />
        )}
        {showModal === 'CreateOrderChooseTypeModal' && (
          <CreateOrderChooseTypeModal />
        )}
        {showModal === 'UpdateCaseModalDialog' && <UpdateCaseModalDialog />}
        {showModal === 'CreateMessageModal' && <CreateMessageModalDialog />}
      </div>
    );
  },
);
