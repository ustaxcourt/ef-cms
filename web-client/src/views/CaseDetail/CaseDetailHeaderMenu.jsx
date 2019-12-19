import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddToTrialModal } from './AddToTrialModal';
import { BlockFromTrialModal } from './BlockFromTrialModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CreateCaseDeadlineModalDialog } from './CreateCaseDeadlineModalDialog';
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
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence: sequences.openUpdateCaseModalSequence,
    resetCaseMenuSequence: sequences.resetCaseMenuSequence,
    showModal: state.showModal,
    toggleMenuSequence: sequences.toggleMenuSequence,
  },
  ({
    caseDetail,
    caseDetailHeaderHelper,
    isCaseDetailMenuOpen,
    openAddEditCaseNoteModalSequence,
    openCreateCaseDeadlineModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence,
    resetCaseMenuSequence,
    showModal,
    toggleMenuSequence,
  }) => {
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
              className="usa-accordion__button usa-nav__link hidden-underline case-detail-menu__button"
              id="case-detail-menu-button"
              onClick={() => {
                toggleMenuSequence({ caseDetailMenu: 'CaseDetailMenu' });
              }}
            >
              Actions
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
                    icon="calendar-alt"
                    id="button-add-deadline"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openCreateCaseDeadlineModalSequence();
                    }}
                  >
                    Add Deadline
                  </Button>
                </li>
                {caseDetailHeaderHelper.showCreateOrderButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      icon="clipboard-list"
                      id="button-create-order"
                      onClick={() => {
                        resetCaseMenuSequence();
                        openCreateOrderChooseTypeModalSequence();
                      }}
                    >
                      Create Order
                    </Button>
                  </li>
                )}
                {caseDetailHeaderHelper.showAddDocketEntryButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      link
                      href={`/case-detail/${caseDetail.docketNumber}/add-docket-entry`}
                      icon="plus-circle"
                    >
                      Add Docket Entry
                    </Button>
                  </li>
                )}
                {caseDetailHeaderHelper.showEditCaseButton && (
                  <li className="usa-nav__submenu-item">
                    <Button
                      icon="edit"
                      id="edit-case-context-button"
                      onClick={() => {
                        resetCaseMenuSequence();
                        openUpdateCaseModalSequence();
                      }}
                    >
                      Edit Case Status/Caption
                    </Button>
                  </li>
                )}
                <li className="usa-nav__submenu-item">
                  <Button
                    icon="sticky-note"
                    id="add-case-note-button"
                    onClick={() => {
                      resetCaseMenuSequence();
                      openAddEditCaseNoteModalSequence();
                    }}
                  >
                    Add Case Note
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
        {showModal == 'UpdateCaseModalDialog' && <UpdateCaseModalDialog />}
      </div>
    );
  },
);
