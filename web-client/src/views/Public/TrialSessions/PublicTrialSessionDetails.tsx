import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormattedPublicTrialSession,
  TrialSessionPublicCaseRow,
} from '@web-client/presenter/computeds/Public/publicTrialSessionDetailsHelper';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { TrialSessionDetailsHeader } from '@web-client/views/TrialSessionDetails/TrialSessionDetailsHeader';
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
          <PublicTrialSessionInformation
            formattedNow={publicTrialSessionDetailsHelper.formattedNow}
            formattedTrialSession={
              publicTrialSessionDetailsHelper.formattedTrialSession
            }
          />
        </section>
      </>
    );
  },
);

PublicTrialSessionDetails.displayName = 'PublicTrialSessionDetails';

const PublicTrialSessionInformation = ({
  formattedNow,
  formattedTrialSession,
}: {
  formattedTrialSession: FormattedPublicTrialSession;
  formattedNow: string;
}) => {
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
      <h2 className="h1-size">Session Information</h2>
      <div className="margin-bottom-205">
        {`Information on this page is current as of ${formattedNow}.`}
      </div>
      {(formattedTrialSession.isSwingSession ||
        formattedTrialSession.hasCourthouseInformation) && (
        <div
          className="card padding-205 maxw-mobile-lg trial-session-public-card"
          data-testid="public-trial-session-details-box"
        >
          <h3 className="underlined">Details</h3>
          <div className="display-flex flex-wrap gap-5">
            {formattedTrialSession.hasCourthouseInformation && (
              <div>
                <span className="label">Courthouse location</span>
                <div className="padding-05"></div>
                <div>{formattedTrialSession.courthouseName}</div>
                <div>{formattedTrialSession.address1}</div>
                <div>{formattedTrialSession.address2}</div>
                <div>{formattedTrialSession.formattedCityStateZip}</div>
              </div>
            )}
            {formattedTrialSession.isSwingSession && (
              <div>
                <span className="label">Swing session</span>
                <div className="padding-05"></div>
                <span className="display-flex gap-1 flex-align-center">
                  <NonPhone>
                    <FontAwesomeIcon
                      aria-label="Swing session: will be held in two cities"
                      className="fa-icon-blue"
                      icon="link"
                      size="sm"
                      title="Swing session: will be held in two cities"
                    />
                  </NonPhone>
                  <a
                    href={`/trial-session-detail/${formattedTrialSession.swingSessionId}`}
                  >
                    {formattedTrialSession.swingSessionLocation}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <NonPhone>
        <NonMobileOpenCases openCases={formattedTrialSession.formattedCases} />
      </NonPhone>
      <Phone>
        <MobileOpenCases openCases={formattedTrialSession.formattedCases} />
      </Phone>
    </>
  );
};

function NonMobileOpenCases({
  openCases,
}: {
  openCases: TrialSessionPublicCaseRow[];
}) {
  return (
    <React.Fragment>
      <div className="text-right">
        <span className="text-semibold">Count: </span>
        {openCases.length}
      </div>
      <div className="padding-1"></div>
      <div className="overflow-x-auto overflow-y-hidden">
        <table
          className="usa-table ustc-table trial-sessions subsection"
          data-testid="public-open-cases"
          id="public-open-cases"
        >
          <thead>
            <tr>
              <th
                aria-label="Icons for consolidated and/or sealed cases"
                className="consolidated-indicators"
              ></th>
              <th aria-label="docket number">Docket No.</th>
              <th>Case Title</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
            </tr>
          </thead>
          <tbody>
            {openCases?.map(publicCase => (
              <tr
                className="eligible-cases-row"
                data-testid={`trial-session-detail-row-${publicCase.docketNumberWithSuffix}`}
                key={publicCase.docketNumberWithSuffix}
              >
                <td>
                  <CaseIcons formattedCase={publicCase} />
                </td>
                <td>
                  <span
                    className={classNames({
                      'margin-left-2':
                        publicCase.inConsolidatedGroup &&
                        !publicCase.isLeadCase,
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
            ))}
          </tbody>
        </table>
      </div>
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
      <div className="text-right">
        <span className="text-semibold">Count: </span>
        {openCases.length}
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
                    {publicCase.inConsolidatedGroup && (
                      <span className="margin-right-105">
                        <ConsolidatedCaseIcon
                          consolidatedIconTooltipText={
                            publicCase.consolidatedIconTooltipText
                          }
                          inConsolidatedGroup={publicCase.inConsolidatedGroup}
                          showLeadCaseIcon={publicCase.isLeadCase}
                        />
                      </span>
                    )}
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
                      {publicCase.privatePractitioners &&
                        publicCase.privatePractitioners.length > 0 && (
                          <div>
                            <span className="label">Petitioner Counsel</span>
                            <div className="display-flex flex-column gap-1">
                              {publicCase.privatePractitioners?.map(counsel => (
                                <div key={counsel.name}>{counsel.name}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      {publicCase.irsPractitioners &&
                        publicCase.irsPractitioners.length > 0 && (
                          <div>
                            <span className="label">Respondent Counsel</span>
                            <div className="display-flex flex-column gap-1">
                              {publicCase.irsPractitioners?.map(counsel => (
                                <div key={counsel.name}>{counsel.name}</div>
                              ))}
                            </div>
                          </div>
                        )}
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
