import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
          id="qc-btn"
          onClick={() => {
            toggleMenuSequence({ openMenu: 'DocumentQCMenu' });
          }}
        >
          <span>Document QC</span>
        </button>
        {isExpanded && (
          <ul className="usa-nav__submenu">
            <li className="usa-nav__submenu-item">
              <a
                href="/document-qc/my/inbox"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                My Document QC
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/document-qc/section/inbox/selectedSection?section=docket"
                id="docket-section-qc"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Docket Section QC
              </a>
            </li>
            <li className="usa-nav__submenu-item">
              <a
                href="/document-qc/section/inbox/selectedSection?section=petitions"
                id="petitions-section-qc"
                onClick={() => {
                  resetHeaderAccordionsSequence();
                  toggleMobileMenuSequence();
                }}
              >
                Petitions Section QC
              </a>
            </li>
          </ul>
        )}
      </>
    );
  },
);

DocumentQCMenu.displayName = 'DocumentQCMenu';
