import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseDetailHeaderMenu = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHeaderHelper: state.caseDetailHeaderHelper,
    menuHelper: state.menuHelper,
    openCreateCaseDeadlineModalSequence:
      sequences.openCreateCaseDeadlineModalSequence,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence: sequences.openUpdateCaseModalSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
  },
  ({
    caseDetail,
    caseDetailHeaderHelper,
    menuHelper,
    openCreateCaseDeadlineModalSequence,
    openCreateOrderChooseTypeModalSequence,
    openUpdateCaseModalSequence,
    toggleMenuSequence,
  }) => {
    return (
      <>
        {caseDetailHeaderHelper.showCaseDetailHeaderMenu && (
          <div className="tablet:grid-col-1">
            <ul className="usa-nav__primary usa-accordion case-detail-menu flex-column flex-align-end">
              <li
                className={classNames(
                  'usa-nav__primary-item',
                  menuHelper.isCaseDetailMenuOpen && 'usa-nav__submenu--open',
                )}
              >
                <button
                  aria-expanded={menuHelper.isCaseDetailMenuOpen}
                  className={classNames(
                    'usa-accordion__button usa-nav__link hidden-underline case-detail-menu__button',
                  )}
                  id="case-detail-menu-button"
                  onClick={() => {
                    toggleMenuSequence({ caseDetailMenu: 'CaseDetailMenu' });
                  }}
                >
                  Actions
                  <FontAwesomeIcon
                    className="margin-left-05"
                    icon={
                      menuHelper.isCaseDetailMenuOpen
                        ? 'caret-up'
                        : 'caret-down'
                    }
                    size="1x"
                  />
                </button>
                {menuHelper.isCaseDetailMenuOpen && (
                  <ul className="usa-nav__submenu position-right-0">
                    <li className="usa-nav__submenu-item">
                      <Button
                        icon="calendar-alt"
                        id="button-add-deadline"
                        onClick={() => {
                          toggleMenuSequence({
                            caseDetailMenu: 'CaseDetailMenu',
                          });
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
                            toggleMenuSequence({
                              caseDetailMenu: 'CaseDetailMenu',
                            });
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
                            toggleMenuSequence({
                              caseDetailMenu: 'CaseDetailMenu',
                            });
                            openUpdateCaseModalSequence();
                          }}
                        >
                          Edit Case Status/Caption
                        </Button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            </ul>
          </div>
        )}
      </>
    );
  },
);
