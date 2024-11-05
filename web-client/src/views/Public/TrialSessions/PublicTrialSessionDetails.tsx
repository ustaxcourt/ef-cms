import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { TrialSessionDetailsHeader } from '@web-client/views/TrialSessionDetails/TrialSessionDetailsHeader';
import { TrialSessionPublicCaseRow } from '@web-client/presenter/computeds/Public/publicTrialSessionDetailsHelper';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PublicTrialSessionDetails = connect(
  {
    publicTrialSessionDetailsHelper: state.publicTrialSessionDetailsHelper,
  },
  function PublicTrialSessionDetails({
    publicTrialSessionDetailsHelper: publicTrialSessionDetailsHelper,
  }) {
    return (
      <>
        <TrialSessionDetailsHeader
          formattedTrialSessionDetails={
            publicTrialSessionDetailsHelper.formattedTrialSession
          }
        />
        <section className="usa-section grid-container">
          <PublicTrialSessionInformation />
        </section>
      </>
    );
  },
);

PublicTrialSessionDetails.displayName = 'PublicTrialSessionDetails';

const PublicTrialSessionInformation = connect(
  {
    publicTrialSessionDetailsHelper: state.publicTrialSessionDetailsHelper,
  },
  function PublicTrialSessionInformation({ publicTrialSessionDetailsHelper }) {
    return (
      <>
        <Button
          link
          className="margin-bottom-1 text-left"
          href="/trial-sessions"
          icon={['fa', 'arrow-alt-circle-left']}
        >
          Back to scheduled trial sessions
        </Button>
        <h1>Session Information</h1>
        <div className="margin-bottom-205">
          {`Information on this page is current as of ${publicTrialSessionDetailsHelper.formattedNow}.`}
        </div>
        {(publicTrialSessionDetailsHelper.formattedTrialSession
          .isSwingSession ||
          publicTrialSessionDetailsHelper.formattedTrialSession
            .hasCourthouseInformation) && (
          <div className="card padding-205 maxw-mobile-lg">
            <h3 className="underlined">Details</h3>
            <div className="display-flex flex-wrap gap-5">
              {publicTrialSessionDetailsHelper.formattedTrialSession
                .hasCourthouseInformation && (
                <div>
                  <span className="label">Courthouse location</span>
                  <div className="padding-05"></div>
                  <div>
                    <span>
                      {
                        publicTrialSessionDetailsHelper.formattedTrialSession
                          .courthouseName
                      }
                    </span>
                    <span className="address-line">
                      {
                        publicTrialSessionDetailsHelper.formattedTrialSession
                          .address1
                      }
                    </span>
                    <span className="address-line">
                      {
                        publicTrialSessionDetailsHelper.formattedTrialSession
                          .address2
                      }
                    </span>
                    <span className="address-line">
                      {
                        publicTrialSessionDetailsHelper.formattedTrialSession
                          .formattedCityStateZip
                      }
                    </span>
                  </div>
                </div>
              )}
              {publicTrialSessionDetailsHelper.formattedTrialSession
                .isSwingSession && (
                <div>
                  <span className="label">Swing session</span>
                  <div className="padding-05"></div>
                  <span className="display-flex gap-1 flex-align-center">
                    <NonPhone>
                      {/* We don't show the swing session icon in mobile because it is not clear without hover tooltip */}
                      <FontAwesomeIcon
                        className="fa-icon-blue"
                        icon="link"
                        size="sm"
                        title="swing session"
                      />
                    </NonPhone>
                    <a
                      href={`/trial-session-detail/${publicTrialSessionDetailsHelper.formattedTrialSession.swingSessionId}`}
                    >
                      {
                        publicTrialSessionDetailsHelper.formattedTrialSession
                          .swingSessionLocation
                      }
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <NonPhone>
          <NonMobileOpenCases
            openCases={
              publicTrialSessionDetailsHelper.formattedTrialSession
                .formattedCases
            }
          />
        </NonPhone>
        <Phone>
          <MobileOpenCases
            openCases={
              publicTrialSessionDetailsHelper.formattedTrialSession
                .formattedCases
            }
          />
        </Phone>
      </>
    );
  },
);

function NonMobileOpenCases({
  openCases,
}: {
  openCases: TrialSessionPublicCaseRow[];
}) {
  return (
    <React.Fragment>
      <div className="text-semibold push-right margin-bottom-2">
        Count: {openCases.length}
      </div>
      <table
        className="usa-table ustc-table trial-sessions subsection"
        data-testid="public-open-cases"
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
        {openCases?.map(publicCase => (
          <tbody key={publicCase.docketNumberWithSuffix}>
            <tr
              className="eligible-cases-row"
              data-testid={`trial-session-detail-row-${publicCase.docketNumberWithSuffix}`}
            >
              <td>
                <CaseIcons formattedCase={publicCase} />
              </td>
              <td>
                <span
                  className={classNames({
                    'margin-left-2':
                      publicCase.inConsolidatedGroup && !publicCase.isLeadCase,
                  })}
                >
                  <CaseLink formattedCase={publicCase} />
                </span>
              </td>
              <td>{publicCase.caseTitle}</td>
              <td>
                {publicCase.privatePractitioners?.map(practitioner => (
                  <div key={practitioner.name}>{practitioner.name}</div>
                ))}
              </td>
              <td>
                {publicCase.irsPractitioners?.map(respondent => (
                  <div key={respondent.name}>{respondent.name}</div>
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

function MobileOpenCases({
  openCases,
}: {
  openCases: TrialSessionPublicCaseRow[];
}) {
  return (
    <React.Fragment>
      <div className="grid-row margin-bottom-2 width-full flex-align-center"></div>
      <div className="width-full text-right">
        <span className="text-bold">Count:</span>{' '}
        <span className="text-semibold">{openCases.length}</span>
      </div>
      <div className="padding-1"></div>
      <table className="usa-table usa-table--stacked-header usa-table--borderless">
        <thead>
          <tr>
            <th scope="col">Case</th>
            <th scope="col">Case Information</th>
          </tr>
        </thead>
        <tbody>
          {openCases.map(publicCase => {
            return (
              <tr className="padding-0" key={publicCase.docketNumberWithSuffix}>
                <td>
                  <div style={{ alignItems: 'center', display: 'flex' }}>
                    <span className="margin-right-3">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          publicCase.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={publicCase.inConsolidatedGroup}
                        showLeadCaseIcon={publicCase.isLeadCase}
                      />
                    </span>
                    <CaseLink formattedCase={publicCase} />
                    {publicCase.isSealed && (
                      <span className="text-right margin-left-auto">
                        <Icon
                          aria-hidden={!publicCase.isSealed}
                          aria-label="sealed"
                          className="sealed-case-entry"
                          icon="lock"
                          title="sealed"
                        />
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div
                    className="padding-bottom-3"
                    key={publicCase.docketNumberWithSuffix}
                  >
                    <div className="display-flex flex-column gap-3">
                      <div>
                        <span className="label">Case Title</span>
                        {publicCase.caseTitle}
                      </div>
                      {publicCase.privatePractitioners?.map(practitioner => (
                        <div key={practitioner?.name}>
                          <span className="label">Petitioner Counsel</span>
                          <div>{practitioner?.name}</div>
                        </div>
                      ))}
                      {publicCase.irsPractitioners?.map(respondent => (
                        <div key={respondent?.name}>
                          <span className="label">Respondent Counsel</span>
                          <div>{respondent?.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openCases.length === 0 && <p>There are no open cases.</p>}
    </React.Fragment>
  );
}
