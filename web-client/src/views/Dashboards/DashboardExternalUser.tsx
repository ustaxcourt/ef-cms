import { BigHeader } from '../BigHeader';
import { CaseListTable } from '../CaseListTable';
import { CaseSearchBox } from '../CaseSearchBox';
import { ErrorNotification } from '../ErrorNotification';
import { FilingFeeOptions } from './FilingFeeOptions';
import { PetitionWelcomePage } from '../PetitionWelcomePage';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardExternalUser = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    user: state.user,
  },
  function DashboardExternalUser({ dashboardExternalHelper, user }) {
    return (
      <React.Fragment>
        <BigHeader
          className="petitioner-welcome-name"
          text={`Welcome, ${user.name}`}
        />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap taxpayer-tools">
            <div className="tablet:grid-col-8">
              {dashboardExternalHelper.showPetitionWelcomePage ? (
                <PetitionWelcomePage
                  isPetitioner={user.role === ROLES.petitioner}
                  welcomeMessage={dashboardExternalHelper.welcomeMessage}
                  welcomeMessageTitle={
                    dashboardExternalHelper.welcomeMessageTitle
                  }
                />
              ) : (
                <CaseListTable />
              )}
            </div>
            <div className="tablet:grid-col-4">
              <CaseSearchBox />
              {user.role === ROLES.petitioner && (
                <div className="card">
                  <div className="content-wrapper gray">
                    <h3 data-testid="taxpayer-tools-section">Taxpayer Tools</h3>
                    <hr />
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
              )}

              {user.role === ROLES.petitioner && (
                <div className="card">
                  <div className="content-wrapper gray">
                    <h3 data-testid="free-taxpayer-help-section">
                      Free Taxpayer Help
                    </h3>
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
              )}
              <FilingFeeOptions />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);

DashboardExternalUser.displayName = 'DashboardExternalUser';
