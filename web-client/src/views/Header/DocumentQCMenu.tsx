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
              <Button
                link
                href="/document-qc/my/inbox"
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
