import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocumentQCMenu = connect(
  {
    pageIsMessages: state.headerHelper.pageIsMessages,
    resetHeaderAccordionsSequence: sequences.resetHeaderAccordionsSequence,
    toggleMenuSequence: sequences.toggleMenuSequence,
    toggleMobileMenuSequence: sequences.toggleMobileMenuSequence,
  },
  function DocumentQCMenu({
    isExpanded,
    pageIsDocumentQC,
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
            pageIsDocumentQC && 'usa-current',
          )}
          id="messages-btn"
          onClick={() => {
            toggleMenuSequence({ openMenu: 'DocumentQCMenu' });
          }}
        >
          <span>Document QC</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <Button
                link
                id="my-qc-btn"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                My Document QC
              </Button>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/" id="docket-section-qc" onClick={() => {}}>
                Docket Section QC
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a href="/" id="petitions-section-qc" onClick={() => {}}>
                Petitions Sections QC
              </a>
            </li>
          </ul>
        )}
      </>
    );
  },
);

DocumentQCMenu.displayName = 'DocumentQCMenu';
