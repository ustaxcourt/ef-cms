import { BigHeader } from '../BigHeader';
import { CaseListPetitioner } from '../CaseListPetitioner';
import { ErrorNotification } from '../ErrorNotification';
import { FilingFeeOptions } from './FilingFeeOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { WhatToExpect } from '../WhatToExpect';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardPetitioner = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    user: state.user,
  },
  function DashboardPetitioner({ dashboardExternalHelper, user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap taxpayer-tools">
            <div className="tablet:grid-col-8">
              {dashboardExternalHelper.showWhatToExpect && <WhatToExpect />}
              {dashboardExternalHelper.showCaseList && <CaseListPetitioner />}
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
                      className="usa-link--external"
                      href="https://ustaxcourt.gov/resources/dawson/how_to_efile_a_petition.pdf"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      How to Create a Case
                    </a>
                  </p>
                  <p>
                    <a
                      className="usa-link--external"
                      href="https://ustaxcourt.gov/dpt_cities.html"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Find a Court Location
                    </a>
                  </p>
                  <p>
                    <a
                      className="usa-link--external"
                      href="https://www.ustaxcourt.gov/case_related_forms.html"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View Forms
                    </a>
                  </p>
                </div>
              </div>

              {dashboardExternalHelper.showWhatToExpect && <FilingFeeOptions />}

              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Free Taxpayer Help</h3>
                  <hr />
                  <p>
                    You may be eligible for additional assistance and advice
                    through a tax clinic or pro-bono program.
                  </p>
                  <p>
                    <a
                      className="usa-link--external"
                      href="https://ustaxcourt.gov/clinics.html"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View Information on Clinics & Pro Bono Programs
                    </a>
                  </p>
                </div>
              </div>

              {dashboardExternalHelper.showWhatToExpect && (
                <div className="card">
                  <div className="content-wrapper gray">
                    <h3>Other Filing Options</h3>

                    <hr />
                    <p>
                      <strong>To file by mail:</strong>
                      <br />
                      Send required forms and filing fee to:
                      <br />
                      United States Tax Court
                      <br />
                      400 Second Street, NW
                      <br />
                      Washington, DC 20217
                    </p>

                    <p>
                      <strong>To file in person:</strong>
                      <br />
                      Please bring your forms and filing fee to:
                      <br />
                      United States Tax Court
                      <br />
                      400 Second Street, NW
                      <br />
                      Washington, DC 20217
                    </p>
                  </div>
                </div>
              )}

              {dashboardExternalHelper.showCaseList && <FilingFeeOptions />}
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
