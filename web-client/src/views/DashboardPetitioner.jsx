import { BigHeader } from './BigHeader';
import { CaseListPetitioner } from './CaseListPetitioner';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from './SuccessNotification';
import { WhatToExpect } from './WhatToExpect';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import howToPrepareYourDocuments from '../pdfs/how-to-prepare-your-documents.pdf';

export const DashboardPetitioner = connect(
  { helper: state.dashboardExternalHelper, user: state.user },
  ({ helper, user }) => {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap taxpayer-tools">
            <div className="tablet:grid-col-8">
              {helper.showWhatToExpect && <WhatToExpect />}
              {helper.showCaseList && <CaseListPetitioner />}
            </div>
            <div className="tablet:grid-col-4">
              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Taxpayer Tools</h3>
                  <hr />
                  <p>
                    <FontAwesomeIcon
                      icon="file-pdf"
                      size="1x"
                      className="fa-icon-blue"
                    />
                    <a
                      href={howToPrepareYourDocuments}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Petition Filing Guide
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://www.ustaxcourt.gov/dpt_cities.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find a court location
                    </a>
                    <FontAwesomeIcon
                      icon="external-link-alt"
                      size="sm"
                      className="fa-icon-blue margin-left-05"
                    />
                  </p>
                  <p>
                    <a
                      href="https://www.ustaxcourt.gov/forms.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View forms
                    </a>
                    <FontAwesomeIcon
                      icon="external-link-alt"
                      size="sm"
                      className="fa-icon-blue margin-left-05"
                    />
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Other Filing Options</h3>
                  <hr />
                  <p>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      How to file a case by mail or in person
                    </a>
                    <FontAwesomeIcon
                      icon="external-link-alt"
                      size="sm"
                      className="fa-icon-blue margin-left-05"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
