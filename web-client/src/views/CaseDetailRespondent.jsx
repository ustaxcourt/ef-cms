import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import { DocketRecord } from './DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FileDocument } from './FileDocument';
import { PartyInformation } from './PartyInformation';
import { SuccessNotification } from './SuccessNotification';

export const CaseDetail = connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
  },
  ({ caseDetail, currentTab, updateCurrentTabSequence }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket Number: {caseDetail.docketNumberWithSuffix}
          </h1>
          <p>{caseDetail.caseTitle}</p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          {currentTab == 'File Document' && <FileDocument />}
          {currentTab != 'File Document' && (
            <nav className="horizontal-tabs">
              <ul role="tabslist">
                <li
                  role="presentation"
                  className={currentTab == 'Docket Record' ? 'active' : ''}
                >
                  <button
                    role="tab"
                    className="tab-link"
                    aria-selected={currentTab === 'Docket Record'}
                    onClick={() =>
                      updateCurrentTabSequence({ value: 'Docket Record' })
                    }
                    id="docket-record-tab"
                  >
                    Docket Record
                  </button>
                </li>
                <li
                  className={currentTab == 'Case Information' ? 'active' : ''}
                >
                  <button
                    role="tab"
                    className="tab-link"
                    id="case-info-tab"
                    aria-selected={currentTab === 'Case Information'}
                    onClick={() =>
                      updateCurrentTabSequence({ value: 'Case Information' })
                    }
                  >
                    Case Information
                  </button>
                </li>
              </ul>
            </nav>
          )}
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              <DocketRecord />
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <PartyInformation />
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
