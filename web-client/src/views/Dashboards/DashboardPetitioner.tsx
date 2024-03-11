import { BigHeader } from '../BigHeader';
import { CaseListTable } from '../CaseListTable';
import { CaseSearchBox } from '../CaseSearchBox';
import { ErrorNotification } from '../ErrorNotification';
import { FilingFeeOptions } from './FilingFeeOptions';
import { OtherFilingOptions } from '@web-client/views/Dashboards/OtherFilingOptions';
import { SuccessNotification } from '../SuccessNotification';
import { WhatToExpect } from '../WhatToExpect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
              {dashboardExternalHelper.showWhatToExpect ? (
                <WhatToExpect />
              ) : (
                <CaseListTable />
              )}
            </div>
            <div className="tablet:grid-col-4">
              <CaseSearchBox />
              <div className="card">
                <div className="content-wrapper gray">
                  <h3>Taxpayer Tools</h3>
                  <hr />
                  <p>
                    <a
                      className="usa-link--external"
                      href="https://www.ustaxcourt.gov/efile_a_petition.html"
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

              {dashboardExternalHelper.showWhatToExpect && <FilingFeeOptions />}

              {dashboardExternalHelper.showWhatToExpect && (
                <OtherFilingOptions />
              )}

              {!dashboardExternalHelper.showWhatToExpect && (
                <FilingFeeOptions />
              )}
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);

DashboardPetitioner.displayName = 'DashboardPetitioner';
