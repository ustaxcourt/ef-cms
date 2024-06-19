import { AddEditCalendarNoteModal } from './AddEditCalendarNoteModal';
import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddEditHearingNoteModal } from './AddEditHearingNoteModal';
import { AddToTrialModal } from './AddToTrialModal';
import { BlockFromTrialModal } from './BlockFromTrialModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
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
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const CaseDetailHeaderMenu = connect(
  {
    addCaseToTrialSessionSequence: sequences.addCaseToTrialSessionSequence,
    addToTrialSessionModalHelper: state.addToTrialSessionModalHelper,
    caseDetail: state.caseDetail,
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    createMessageSequence: sequences.createMessageSequence,
    menuHelper: state.menuHelper,
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
    updateCaseNoteSequence: sequences.updateCaseNoteSequence,
    validateAddToTrialSessionSequence:
      sequences.validateAddToTrialSessionSequence,
  },
  function CaseDetailHeaderMenu({
    addCaseToTrialSessionSequence,
    addToTrialSessionModalHelper,
    caseDetail,
    caseDetailHeaderHelper,
    createMessageSequence,
    menuHelper,
    navigateToPathSequence,
    openAddEditCaseNoteModalSequence,
    openCaseInNewTabSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateMessageModalSequence,
    openCreateOrderChooseTypeModalSequence,
    resetCaseMenuSequence,
    showModal,
    toggleMenuSequence,
    updateCaseNoteSequence,
    validateAddToTrialSessionSequence,
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
      window.document.addEventListener('mousedown', reset, false);
      window.document.addEventListener('keydown', keydown, false);
      return () => {
        resetCaseMenuSequence();
        window.document.removeEventListener('mousedown', reset, false);
        window.document.removeEventListener('keydown', keydown, false);
      };
    }, []);

    const caseMenu = () => (
      <ul className="usa-nav__submenu position-right-0">
        <li className="usa-nav__submenu-item" id="menu-button-new-tab">
          <Button
            onClick={() => {
              resetCaseMenuSequence();
              openCaseInNewTabSequence();
            }}
          >
            <Icon
              aria-label="new tab"
              className="margin-right-1"
              icon="arrow-right"
              size="1x"
            />
            New Tab
          </Button>

          <hr className="margin-0" />
        </li>

        {caseDetailHeaderHelper.showCreateMessageButton && (
          <li
            className="usa-nav__submenu-item"
            data-testid="menu-button-add-new-message"
            id="menu-button-add-new-message"
          >
            <Button
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
            </Button>
            <hr className="margin-0" />
          </li>
        )}
        <li className="usa-nav__submenu-item" id="menu-button-add-deadline">
          <Button
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
          </Button>
          <hr className="margin-0" />
        </li>

        {caseDetailHeaderHelper.showCreateOrderButton && (
          <li
            className="usa-nav__submenu-item"
            data-testid="menu-button-create-order"
            id="menu-button-create-order"
          >
            <Button
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
            </Button>
            <hr className="margin-0" />
          </li>
        )}
        {caseDetailHeaderHelper.showAddDocketEntryButton && (
          <li
            className="usa-nav__submenu-item"
            data-testid="menu-button-add-paper-filing"
          >
            <Button
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
            </Button>
            <hr className="margin-0" />
          </li>
        )}

        {caseDetailHeaderHelper.showUploadCourtIssuedDocumentButton && (
          <li
            className="usa-nav__submenu-item"
            data-testid="menu-button-upload-pdf"
          >
            <Button
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
            </Button>
            <hr className="margin-0" />
          </li>
        )}

        {caseDetailHeaderHelper.showAddCorrespondenceButton && (
          <li className="usa-nav__submenu-item" id="correspondence-button">
            <Button
              onClick={() => {
                navigateToPathSequence({
                  path: `/case-detail/${caseDetail.docketNumber}/upload-correspondence`,
                });
              }}
            >
              <Icon
                aria-label="create correspondence"
                className="margin-right-1 fa-icon-blue"
                icon="mail-bulk"
                size="1x"
              />
              Correspondence
            </Button>

            <hr className="margin-0" />
          </li>
        )}

        <li className="usa-nav__submenu-item" id="menu-add-case-note-button">
          <Button
            onClick={() => {
              resetCaseMenuSequence();
              openAddEditCaseNoteModalSequence();
            }}
          >
            <Icon
              aria-label="create case note"
              className="margin-right-1"
              icon="sticky-note"
              size="1x"
            />
            Case Note
          </Button>
        </li>
      </ul>
    );
    return (
      <div className="tablet:grid-col-1" ref={menuRef}>
        <ul className="usa-nav__primary usa-accordion case-detail-menu flex-column flex-align-end">
          <li
            className={classNames(
              'usa-nav__primary-item',
              menuHelper.isCaseDetailMenuOpen && 'usa-nav__submenu--open',
            )}
          >
            <button
              aria-expanded={menuHelper.isCaseDetailMenuOpen}
              className="usa-accordion__button usa-nav__link hidden-underline case-detail-menu__button text-no-wrap"
              data-testid="case-detail-menu-button"
              id="case-detail-menu-button"
              onClick={() => {
                toggleMenuSequence({ caseDetailMenu: 'CaseDetailMenu' });
              }}
            >
              Create{' '}
              <FontAwesomeIcon
                icon={
                  menuHelper.isCaseDetailMenuOpen ? 'caret-up' : 'caret-down'
                }
              />
            </button>

            {menuHelper.isCaseDetailMenuOpen && caseMenu()}
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
          <AddEditCaseNoteModal onConfirmSequence={updateCaseNoteSequence} />
        )}
        {showModal === 'AddEditCalendarNoteModal' && (
          <AddEditCalendarNoteModal />
        )}
        {showModal === 'AddEditHearingNoteModal' && <AddEditHearingNoteModal />}
        {showModal === 'AddToTrialModal' && (
          <AddToTrialModal
            confirmSequence={addCaseToTrialSessionSequence}
            modalHelper={addToTrialSessionModalHelper}
            modalTitle="Add to Trial Session"
            validateSequence={validateAddToTrialSessionSequence}
          />
        )}
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
        {showModal === 'CreateMessageModal' && (
          <CreateMessageModalDialog onConfirmSequence={createMessageSequence} />
        )}
      </div>
    );
  },
);
