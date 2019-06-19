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
                      className="fa-icon-blue"
                      icon="file-pdf"
                      size="1x"
                    />
                    <a
                      href={howToPrepareYourDocuments}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Petition Filing Guide
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://www.ustaxcourt.gov/dpt_cities.htm"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Find a court location
                    </a>
                    <FontAwesomeIcon
                      className="fa-icon-blue margin-left-05"
                      icon="external-link-alt"
                      size="sm"
                    />
                  </p>
                  <p>
                    <a
                      href="https://www.ustaxcourt.gov/forms.htm"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View forms
                    </a>
                    <FontAwesomeIcon
                      className="fa-icon-blue margin-left-05"
                      icon="external-link-alt"
                      size="sm"
                    />
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Other Filing Options</h3>
                  <hr />
                  <p>
                    <a href="/" rel="noopener noreferrer" target="_blank">
                      How to file a case by mail or in person
                    </a>
                    <FontAwesomeIcon
                      className="fa-icon-blue margin-left-05"
                      icon="external-link-alt"
                      size="sm"
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
