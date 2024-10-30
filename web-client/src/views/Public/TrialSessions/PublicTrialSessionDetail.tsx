import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { TrialSessionDetailHeader } from '@web-client/views/TrialSessionDetail/TrialSessionDetailHeader';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const PublicTrialSessionDetail = connect(
  {
    publicTrialSessionDetailHelper: state.publicTrialSessionDetailHelper,
    trialSession: state.trialSessionDetailsPage.trialSession,
  },
  function PublicTrialSessionDetail({ publicTrialSessionDetailHelper }) {
    return (
      <>
        <TrialSessionDetailHeader
          formattedTrialSessionDetails={
            publicTrialSessionDetailHelper.formattedTrialSession
          }
        />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <WarningNotification />

          <PublicTrialSessionInformation />
          {/* TODO: Open cases */}
        </section>
      </>
    );
  },
);

PublicTrialSessionDetail.displayName = 'TrialSessionDetail';

export const PublicTrialSessionInformation = connect(
  {
    publicTrialSessionDetailHelper: state.publicTrialSessionDetailHelper,
    trialSession: state.trialSessionDetailsPage.trialSession,
  },
  function PublicTrialSessionInformation({
    publicTrialSessionDetailHelper,
    trialSession,
  }) {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="grid-col-auto">
              <h1>Session Information</h1>
            </div>
          </div>
        </div>
        <div className="margin-bottom-4">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap margin-bottom-2">
              <div className="grid-col-6">
                <div className="card trial-session-card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Details</h3>
                    <div className="display-flex padding-x-0 padding-top-1 padding-bottom-1">
                      <div>
                        <p className="label">Courthouse location</p>
                        <div className="padding-05"></div>
                        <div>
                          <p>
                            <span>{trialSession.courthouseName}</span>
                            <span className="address-line">
                              {trialSession.address1}
                            </span>
                            <span className="address-line">
                              {trialSession.address2}
                            </span>
                            <span className="address-line">
                              {
                                publicTrialSessionDetailHelper
                                  .formattedTrialSession.formattedCityStateZip
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                      {trialSession.isSwingSession && (
                        <div>
                          <p className="label">Swing session</p>
                          <div className="padding-05"></div>
                          <span className="display-flex gap-1 flex-align-center">
                            <FontAwesomeIcon
                              className="fa-icon-blue"
                              icon="link"
                              size="sm"
                              title="swing session"
                            />
                            <a
                              href={`/trial-session-detail/${trialSession.swingSessionId}`}
                            >
                              {trialSession.swingSessionLocation}
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

PublicTrialSessionInformation.displayName = 'PublicTrialSessionInformation';
