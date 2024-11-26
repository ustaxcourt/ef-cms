import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const TrialSessionMetadataFieldset = ({
  onBlurHandler,
  onChangeHandler,
  trialSessionMetadataFormState,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  trialSessionMetadataFormState: MinuteSheetFormState['trialSessionMetadata'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap">
        <div className="grid-col">
          <FormGroup className="grid-row grid-gap margin-bottom-0">
            <label className="grid-col-2 margin-bottom-0" htmlFor="judge">
              Judge
            </label>
            <input
              className="usa-input grid-col-10"
              id="judge"
              name="judge"
              type="text"
              value={trialSessionMetadataFormState.judge}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'trialSessionMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col">
          <FormGroup className="grid-row grid-gap margin-bottom-0">
            <label
              className="grid-col-2 margin-bottom-0"
              htmlFor="courtReporter"
            >
              Court reporter
            </label>
            <input
              className="usa-input grid-col-10"
              id="courtReporter"
              name="courtReporter"
              type="text"
              value={trialSessionMetadataFormState.courtReporter}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'trialSessionMetadata',
                })
              }
            />
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col">
          <FormGroup className="grid-row grid-gap margin-bottom-0">
            <label className="grid-col-2 margin-bottom-0" htmlFor="trialClerk">
              Trial clerk
            </label>
            <input
              className="usa-input grid-col-10"
              id="trialClerk"
              name="trialClerk"
              type="text"
              value={trialSessionMetadataFormState.trialClerk}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'trialSessionMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col">
          <FormGroup className="margin-bottom-0">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={trialSessionMetadataFormState.remoteSession}
                className="usa-checkbox__input"
                id="remoteSession"
                name="remoteSession"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'trialSessionMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-bottom-0"
                htmlFor="remoteSession"
              >
                Remote Session
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
    </fieldset>
  );
};
