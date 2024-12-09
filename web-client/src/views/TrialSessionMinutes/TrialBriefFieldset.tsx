import {
  BRIEF_TYPE_OPTIONS,
  MinuteSheetFormState,
  SeriatimBriefFormFields,
  SeriatimMemorandumFormFields,
  SimultaneousBriefFormFields,
  SimultaneousMemorandaOfLawFormFields,
  SimultaneousMemorandumFormFields,
  SimultaneousSupplementalFormFields,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { SeriatimFieldset } from './BriefDetailsFieldsets/SeriatimFieldset';
import { SimultaneousBriefFormFieldset } from './BriefDetailsFieldsets/SimultaneousBriefFormFieldset';
import { SimultaneousMemorandaOfLawFormFieldset } from './BriefDetailsFieldsets/SimultaneousMemorandaOfLawFormFieldset';
import { SimultaneousMemorandumFormFieldset } from './BriefDetailsFieldsets/SimultaneousMemorandumFormFieldset';
import { SimultaneousSupplementalBriefFieldset } from './BriefDetailsFieldsets/SimultaneousSupplementalBriefFieldset';
import React from 'react';

export const TrialBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  trialBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  trialBriefFormState: MinuteSheetFormState['trialBrief'];
}) => {
  const renderBriefForm = (briefType: string) => {
    const briefFormMap = {
      [BRIEF_TYPE_OPTIONS.seriatimBrief]: (
        <SeriatimFieldset
          key={BRIEF_TYPE_OPTIONS.seriatimBrief}
          seriatimFormState={
            trialBriefFormState.briefDetails as SeriatimBriefFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.seriatimMemorandum]: (
        <SeriatimFieldset
          key={BRIEF_TYPE_OPTIONS.seriatimMemorandum}
          seriatimFormState={
            trialBriefFormState.briefDetails as SeriatimMemorandumFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneousSupplemental]: (
        <SimultaneousSupplementalBriefFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneousSupplemental}
          simultaneousSupplementalBriefFormState={
            trialBriefFormState.briefDetails as SimultaneousSupplementalFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneous]: (
        <SimultaneousBriefFormFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneous}
          simultaneousBriefFormState={
            trialBriefFormState.briefDetails as SimultaneousBriefFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneousMemorandum]: (
        <SimultaneousMemorandumFormFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneousMemorandum}
          simultaneousMemorandumFormState={
            trialBriefFormState.briefDetails as SimultaneousMemorandumFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneousMemoranda]: (
        <SimultaneousMemorandaOfLawFormFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneousMemoranda}
          simultaneousMemorandaOfLawFormState={
            trialBriefFormState.briefDetails as SimultaneousMemorandaOfLawFormFields
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
    };

    return briefFormMap[briefType];
  };

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
                  <option key={optionKey} value={BRIEF_TYPE_OPTIONS[optionKey]}>
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
