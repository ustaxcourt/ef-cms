import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { TrialSessionDetailHeader } from '@web-client/views/TrialSessionDetail/TrialSessionDetailHeader';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import classNames from 'classnames';

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
        <Button
          link
          className="margin-bottom-3"
          href="/trial-sessions"
          icon={['fa', 'arrow-alt-circle-left']}
        >
          Back to scheduled trial sessions
        </Button>
        <h1>Session Information</h1>
        {(trialSession.isSwingSession ||
          publicTrialSessionDetailHelper.formattedTrialSession
            .hasCourthouseInformation) && (
          <div className="card padding-205 maxw-mobile-lg">
            <h3 className="underlined">Details</h3>
            <div className="display-flex flex-wrap gap-3">
              {publicTrialSessionDetailHelper.formattedTrialSession
                .hasCourthouseInformation && (
                <div>
                  <span className="label">Courthouse location</span>
                  <div className="padding-05"></div>
                  <div>
                    <span>{trialSession.courthouseName}</span>
                    <span className="address-line">
                      {trialSession.address1}
                    </span>
                    <span className="address-line">
                      {trialSession.address2}
                    </span>
                    <span className="address-line">
                      {
                        publicTrialSessionDetailHelper.formattedTrialSession
                          .formattedCityStateZip
                      }
                    </span>
                  </div>
                </div>
              )}
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
        )}
        <NonMobile>
          <NonMobileOpenCases
            openCases={
              publicTrialSessionDetailHelper.formattedTrialSession
                .formattedCases
            }
          />
        </NonMobile>
        <Mobile>
          <MobileOpenCases
            openCases={
              publicTrialSessionDetailHelper.formattedTrialSession
                .formattedCases
            }
          />
        </Mobile>
      </>
    );
  },
);

PublicTrialSessionInformation.displayName = 'PublicTrialSessionInformation';

function NonMobileOpenCases({ openCases }) {
  console.log('openCases', openCases);
  return (
    <React.Fragment>
      <div className="text-semibold push-right margin-bottom-2">
        Count: {openCases.length}
      </div>
      <table
        className="usa-table ustc-table trial-sessions subsection"
        id="public-open-cases"
      >
        <thead>
          <tr>
            <th
              aria-label="consolidated group indicator"
              className="consolidated-indicators"
            ></th>
            <th aria-label="docket number">Docket No.</th>
            <th>Case Title</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
          </tr>
        </thead>
        {openCases?.map(item => (
          <tbody key={item.docketNumber}>
            <tr className="eligible-cases-row">
              <td>
                <span
                  className={classNames({
                    'margin-left-2':
                      item.inConsolidatedGroup && !item.isLeadCase,
                  })}
                >
                  <ConsolidatedCaseIcon
                    consolidatedIconTooltipText={
                      item.consolidatedIconTooltipText
                    }
                    inConsolidatedGroup={item.inConsolidatedGroup}
                    showLeadCaseIcon={item.isLeadCase}
                  />
                </span>
              </td>
              <td>
                <span
                  className={classNames({
                    'margin-left-2':
                      item.inConsolidatedGroup && !item.isLeadCase,
                  })}
                >
                  <CaseLink formattedCase={item} />
                </span>
              </td>
              <td>{item.caseTitle}</td>
              <td>
                {item.privatePractitioners?.map(practitioner => (
                  <div key={practitioner.userId}>{practitioner.name}</div>
                ))}
              </td>
              <td>
                {item.irsPractitioners?.map(respondent => (
                  <div key={respondent.userId}>{respondent.name}</div>
                ))}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      {openCases.length === 0 && <p>There are no open cases.</p>}
    </React.Fragment>
  );
}

function MobileOpenCases({ openCases }) {
  return (
    <React.Fragment>
      Mobile: Do stuff here
      {openCases.length === 0 && <p>There are no open cases.</p>}
    </React.Fragment>
  );
}
