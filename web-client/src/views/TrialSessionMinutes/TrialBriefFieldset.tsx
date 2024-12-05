import {
  BRIEF_TYPE_OPTIONS,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';

const renderBriefForm = (briefType: string) => {
  console.log(briefType);
  const briefFormMap = {
    seriatim: <div>Seriatim brief</div>,
    seriatimMemorandum: <div>Seriatim memorandum brief</div>,
  };

  return briefFormMap[briefType];
};

export const TrialBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  trialBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  trialBriefFormState: MinuteSheetFormState['trialBrief'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap">
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="briefType"
            >
              Type
            </label>
            <select
              className="usa-select display-inline-block"
              id="briefType"
              name="briefType"
              value={trialBriefFormState.briefType}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'briefType',
                  section: 'trialBrief',
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {Object.keys(BRIEF_TYPE_OPTIONS).map(optionKey => {
                return (
                  <option key={optionKey} value={optionKey}>
                    {BRIEF_TYPE_OPTIONS[optionKey]}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        </div>
        <div className="grid-col-10">
          {renderBriefForm(trialBriefFormState.briefType)}
        </div>
      </div>
    </fieldset>
  );
};
