import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const ReportsMenu = connect(
  {
    toggleReportsMenuSequence: sequences.toggleReportsMenuSequence,
  },
  ({ isExpanded, toggleReportsMenuSequence }) => {
    return (
      <>
        <button
          aria-expanded={isExpanded}
          className={classNames(
            'usa-accordion__button usa-nav__link',
            isExpanded && 'usa-current',
          )}
          onClick={() => toggleReportsMenuSequence()}
        >
          <span>Reports</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/reports/case-deadlines" id="all-deadlines">
                Deadlines
              </a>
            </li>
          </ul>
        )}
      </>
    );
  },
);
