import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddToTrialModal } from './AddToTrialModal';
import { BlockFromTrialModal } from './BlockFromTrialModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CreateCaseDeadlineModalDialog } from './CreateCaseDeadlineModalDialog';
import { CreateMessageModalDialog } from '../Messages/CreateMessageModalDialog';
import { CreateOrderChooseTypeModal } from '../CreateOrder/CreateOrderChooseTypeModal';
import { DeleteCaseDeadlineModalDialog } from './DeleteCaseDeadlineModalDialog';
import { EditCaseDeadlineModalDialog } from './EditCaseDeadlineModalDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    openAddEditCaseNoteModalSequence:
      sequences.openAddEditCaseNoteModalSequence,
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
    openAddEditCaseNoteModalSequence,
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
                <li className="usa-nav__submenu-item">
                  <Button
                    href={`/case-detail/${caseDetail.docketNumber}`}
                    icon="arrow-right"
                    id="menu-button-new-tab"
                    rel="noreferrer"
                    target="_blank"
                  >
                    New Tab
                  </Button>
                  <hr></hr>
                </li>

                <li className="usa-nav__submenu-item">
                  <Button
                    icon="envelope"
                    id="menu-button-add-new-message"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openCreateMessageModalSequence();
                    }}
                  >
                    Message
                  </Button>
                  <hr></hr>
                </li>
                <li className="usa-nav__submenu-item">
                  <Button
                    icon="calendar-alt"
                    id="menu-button-add-deadline"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openCreateCaseDeadlineModalSequence();
                    }}
                  >
                    Deadline
                  </Button>
                  <hr></hr>
                </li>

                {caseDetailHeaderHelper.showCreateOrderButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      icon="clipboard-list"
                      id="menu-button-create-order"
                      onClick={() => {
                        resetCaseMenuSequence();
                        openCreateOrderChooseTypeModalSequence();
                      }}
                    >
                      Order or Notice
                    </Button>
                    <hr></hr>
                  </li>
                )}
                {caseDetailHeaderHelper.showAddDocketEntryButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      link
                      href={`/case-detail/${caseDetail.docketNumber}/add-paper-filing`}
                      icon="plus-circle"
                      id="menu-button-add-docket-entry"
                    >
                      Paper Filing
                    </Button>
                    <hr></hr>
                  </li>
                )}

                {caseDetailHeaderHelper.showUploadCourtIssuedDocumentButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      link
                      className="fa-icon-blue"
                      href={`/case-detail/${caseDetail.docketNumber}/upload-court-issued`}
                      icon="file-pdf"
                      iconColor="blue"
                      id="menu-button-upload-pdf"
                    >
                      PDF Upload
                    </Button>
                    <hr></hr>
                  </li>
                )}

                {caseDetailHeaderHelper.showAddCorrespondenceButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      link
                      className="fa-icon-blue"
                      href={`/case-detail/${caseDetail.docketNumber}/upload-correspondence`}
                      icon="mail-bulk"
                      iconColor="blue"
                      id="menu-button-upload-pdf"
                    >
                      Correspondence
                    </Button>
                    <hr></hr>
                  </li>
                )}

                <li className="usa-nav__submenu-item">
                  <Button
                    icon="sticky-note"
                    id="menu-add-case-note-button"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openAddEditCaseNoteModalSequence();
                    }}
                  >
                    Case Note
                  </Button>
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
