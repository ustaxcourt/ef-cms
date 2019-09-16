import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const ReportsMenu = connect(
  {
    pageIsReports: state.headerHelper.pageIsReports,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
  },
  ({
    isExpanded,
    pageIsReports,
    resetHeaderAccordionsSequence,
    toggleMenuSequence,
  }) => {
    return (
      <>
        <button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            pageIsReports && 'usa-current',
          )}
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
                onClick={() => resetHeaderAccordionsSequence()}
              >
                Deadlines
              </a>
            </li>
          </ul>
        )}
      </>
    );
  },
);
