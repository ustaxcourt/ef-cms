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
        <h1>Session Information</h1>
        <div className="card padding-205 maxw-mobile-lg">
          <h3 className="underlined">Details</h3>
          <div className="display-flex flex-wrap gap-3">
            <div>
              <span className="label">Courthouse location</span>
              <div className="padding-05"></div>
              <div>
                <span>{trialSession.courthouseName}</span>
                <span className="address-line">{trialSession.address1}</span>
                <span className="address-line">{trialSession.address2}</span>
                <span className="address-line">
                  {
                    publicTrialSessionDetailHelper.formattedTrialSession
                      .formattedCityStateZip
                  }
                </span>
              </div>
            </div>
            {trialSession.isSwingSession && (
              <div>
                <span className="label">Swing session</span>
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
      </>
    );
  },
);

PublicTrialSessionInformation.displayName = 'PublicTrialSessionInformation';
