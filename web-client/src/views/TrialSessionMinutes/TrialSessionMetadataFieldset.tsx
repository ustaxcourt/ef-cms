import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MINUTE_SHEET_FORM_SECTION_MAP } from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';

export const TrialSessionMetadataFieldset = ({
  onBlurHandler,
  onChangeHandler,
  formOptions,
  trialSessionMetadataFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  formOptions: MinuteSheetFormState['options']['judgeOptions'];
  trialSessionMetadataFormState: MinuteSheetFormState['trialSessionMetadataSection'];
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap">
        <div className="grid-col">
          <FormGroup className="grid-row grid-gap margin-bottom-0">
            <label className="grid-col-2 margin-bottom-0" htmlFor="judge">
              Judge
            </label>
            <select
              className="usa-select grid-col-10"
              id="judge"
              name="judge"
              value={trialSessionMetadataFormState.judge.userId}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                const selectedJudge = formOptions[e.target.value];
                onChangeHandler({
                  name: e.target.name,
                  section:
                    MINUTE_SHEET_FORM_SECTION_MAP.trialSessionMetadataSection,
                  value: selectedJudge,
                });
              }}
            >
              {Object.values(formOptions).map(judge => (
                <option key={judge.userId} value={judge.userId}>
                  {judge.fullName}
                </option>
              ))}
            </select>
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
            <div style={{ left: '100px', position: 'absolute', right: 0 }}>
              <input
                className="usa-input grid-col-10"
                id="courtReporter"
                data-testid="courtReporter"
                name="courtReporter"
                style={{ maxWidth: 'none', width: '100%' }}
                type="text"
                value={trialSessionMetadataFormState.courtReporter}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: e.target.name,
                    section:
                      MINUTE_SHEET_FORM_SECTION_MAP.trialSessionMetadataSection,
                    value: e.target.value,
                  })
                }
              />
            </div>
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
                  section:
                    MINUTE_SHEET_FORM_SECTION_MAP.trialSessionMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col">
          <FormGroup className="margin-bottom-0 display-inline-block">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={trialSessionMetadataFormState.remoteSession}
                className="usa-checkbox__input"
                data-testid="remoteSession"
                id="remoteSession"
                name="remoteSession"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    section:
                      MINUTE_SHEET_FORM_SECTION_MAP.trialSessionMetadataSection,
                    value: e.target.checked,
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
