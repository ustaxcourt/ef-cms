import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const ReportsMenu = connect(
  {
    openCaseInventoryReportModalSequence:
      sequences.openCaseInventoryReportModalSequence,
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    reportMenuHelper: state.reportMenuHelper,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
  },
  function ReportsMenu({
    isExpanded,
    openCaseInventoryReportModalSequence,
    openTrialSessionPlanningModalSequence,
    reportMenuHelper,
    resetHeaderAccordionsSequence,
    toggleMenuSequence,
    toggleMobileMenuSequence,
  }) {
    return (
      <>
        <button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            reportMenuHelper.pageIsReports && 'usa-current',
          )}
          data-testid="dropdown-select-report"
          id="reports-btn"
          onClick={() => {
            toggleMenuSequence({ openMenu: 'ReportsMenu' });
          }}
        >
          <span>Reports</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            {reportMenuHelper.showActivityReport && (
              <li className="usa-nav__submenu-item">
                <a
                  data-testid="activity-report-link"
                  href="/reports/judge-activity-report"
                  onClick={() => {
                    resetHeaderAccordionsSequence();
                    toggleMobileMenuSequence();
                  }}
                >
                  Activity
                </a>
              </li>
            )}
            <li className="usa-nav__submenu-item">
              <Button
                link
                id="case-inventory-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                  openCaseInventoryReportModalSequence();
                }}
              >
                Case Inventory
              </Button>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/reports/custom-case"
                id="custom-case-report-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Custom Case Report
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/reports/blocked-cases"
                id="all-blocked-cases"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Blocked Cases
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/reports/case-deadlines"
                id="all-deadlines"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Deadlines
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                data-testid="select-pending-report"
                href="/reports/pending-report"
                id="pending-report"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Pending Report
              </a>
            </li>
            <li className="usa-nav__submenu-item" id="reports-nav">
              <Button
                link
                id="trial-session-planning-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                  openTrialSessionPlanningModalSequence();
                }}
              >
                Trial Session Planning
              </Button>
            </li>
          </ul>
        )}
      </>
    );
  },
);

ReportsMenu.displayName = 'ReportsMenu';
