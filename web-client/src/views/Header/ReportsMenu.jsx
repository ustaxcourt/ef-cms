import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const ReportsMenu = connect(
  {
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    pageIsReports: state.headerHelper.pageIsReports,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
  },
  ({
    isExpanded,
    openTrialSessionPlanningModalSequence,
    pageIsReports,
    resetHeaderAccordionsSequence,
    toggleMenuSequence,
    toggleMobileMenuSequence,
  }) => {
    return (
      <>
        <button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            pageIsReports && 'usa-current',
          )}
          id="reports-btn"
          onClick={() => {
            toggleMenuSequence({ openMenu: 'ReportsMenu' });
          }}
        >
          <span>Reports</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
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
            <li className="usa-nav__submenu-item">
              <a
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
          </ul>
        )}
      </>
    );
  },
);
