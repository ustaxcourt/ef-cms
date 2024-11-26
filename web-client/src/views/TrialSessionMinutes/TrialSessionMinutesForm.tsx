import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { FormatTrialSessionHelperType } from '@web-client/presenter/computeds/formattedTrialSessionDetails';
import React from 'react';
// http://localhost:1234/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc/case/101-20/minutes

export const TrialSessionMinutesForm = ({
  formattedTrialSessionDetails,
  trialSessionMinutesOnChangeSequence,
}: {
  formattedTrialSessionDetails: FormatTrialSessionHelperType;
  trialSessionMinutesOnChangeSequence: (event) => void;
}) => {
  return (
    <form>
      {/*
        TODO actually fill this with form sections containing inputs
        This is just a temporary stub to get started
      */}
      <div>Trial Session Metadata Section</div>
      <fieldset className="border-0 grid-container padding-0">
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <FormGroup className="grid-row grid-gap">
              <label className="grid-col-2" htmlFor="judge">
                Judge
              </label>
              <input
                className="grid-col-10"
                id="judge"
                name="judge"
                type="text"
                value={formattedTrialSessionDetails.formattedJudge}
                onChange={e =>
                  trialSessionMinutesOnChangeSequence({
                    name: e.target.name,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
          <div className="grid-col">
            <FormGroup className="grid-row grid-gap">
              <label className="grid-col-2" htmlFor="courtReporter">
                Court reporter
              </label>
              <input
                className="usa-input grid-col-10"
                id="courtReporter"
                name="courtReporter"
                type="text"
                value={formattedTrialSessionDetails.formattedCourtReporter}
              />
            </FormGroup>
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <FormGroup className="grid-row grid-gap">
              <label className="grid-col-2" htmlFor="trialClerk">
                Trial clerk
              </label>
              <input
                className="usa-input grid-col-10"
                id="trialClerk"
                name="trialClerk"
                type="text"
                value={formattedTrialSessionDetails.formattedTrialClerk}
              />
            </FormGroup>
          </div>
          <div className="grid-col">
            <FormGroup>
              <div className="usa-checkbox">
                <input
                  aria-describedby="representing-legend"
                  checked={formattedTrialSessionDetails.isRemoteSession}
                  className="usa-checkbox__input"
                  id="remoteSession"
                  name="remoteSession"
                  type="checkbox"
                  onChange={() => {}}
                />
                <label className="usa-checkbox__label" htmlFor="remoteSession">
                  Remote Session
                </label>
              </div>
            </FormGroup>
          </div>
        </div>
      </fieldset>

      <hr />
      <div>Case Metadata Section</div>
      <hr />
      <div>Parties Section</div>
      <hr />
      <div>Jurisdiction Retained Section</div>
      <hr />
      <div>Orders Section</div>
      <hr />
      <div>Motions Section</div>
      <hr />
      <div>Actions and Filings Section</div>
      <hr />
      <div>Trial Brief Section</div>
      <hr />
      <div>Witnesses Section</div>
      <hr />
      <div>Exhibits Section</div>
    </form>
  );
};
