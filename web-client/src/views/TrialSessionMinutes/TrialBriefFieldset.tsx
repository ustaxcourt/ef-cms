import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  BRIEF_TYPE_OPTIONS,
  MINUTE_SHEET_FORM_SECTION_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { SeriatimFieldset } from './BriefDetailsFieldsets/SeriatimFieldset';
import { SimultaneousBriefFormFieldset } from './BriefDetailsFieldsets/SimultaneousBriefFormFieldset';
import { SimultaneousMemorandaOfLawFormFieldset } from './BriefDetailsFieldsets/SimultaneousMemorandaOfLawFormFieldset';
import { SimultaneousSupplementalBriefFieldset } from './BriefDetailsFieldsets/SimultaneousSupplementalBriefFieldset';
import React from 'react';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  SeriatimBrief,
  SimultaneousSupplemental,
  SimultaneousBrief,
  SimultaneousMemorandaOfLaw,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const TrialBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  trialBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  trialBriefFormState: MinuteSheetFormState['trialBriefSection'];
}) => {
  const renderBriefForm = (briefType: string) => {
    const briefFormMap = {
      [BRIEF_TYPE_OPTIONS.seriatimBrief]: (
        <SeriatimFieldset
          key={BRIEF_TYPE_OPTIONS.seriatimBrief}
          seriatimFormState={trialBriefFormState.briefDetails as SeriatimBrief}
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneousSupplemental]: (
        <SimultaneousSupplementalBriefFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneousSupplemental}
          simultaneousSupplementalBriefFormState={
            trialBriefFormState.briefDetails as SimultaneousSupplemental
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneous]: (
        <SimultaneousBriefFormFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneous}
          simultaneousBriefFormState={
            trialBriefFormState.briefDetails as SimultaneousBrief
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
      [BRIEF_TYPE_OPTIONS.simultaneousMemoranda]: (
        <SimultaneousMemorandaOfLawFormFieldset
          key={BRIEF_TYPE_OPTIONS.simultaneousMemoranda}
          simultaneousMemorandaOfLawFormState={
            trialBriefFormState.briefDetails as SimultaneousMemorandaOfLaw
          }
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
      ),
    };

    return briefFormMap[briefType];
  };

  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap align-items-center margin-bottom-2">
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={trialBriefFormState.dateSubmitted}
            formGroupClassNames="margin-bottom-0"
            id="trialBriefDateSubmitted"
            label="Date submitted"
            placeHolderText="MM/DD/YYYY"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'dateSubmitted',
                section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-2">
          <label
            className="usa-label margin-right-2"
            htmlFor="trialBriefTotalTrialHours"
          >
            Total Trial Hours
          </label>
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <input
              className="usa-input display-inline-block maxw-full"
              id="trialBriefTotalTrialHours"
              name="trialBriefTotalTrialHours"
              type="text"
              value={trialBriefFormState.totalTrialHours}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'totalTrialHours',
                  section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={trialBriefFormState.dateBenchOpinionRendered}
            formGroupClassNames="margin-bottom-0"
            id="dateBenchOpinionRendered"
            label="Bench Opinion rendered"
            placeHolderText="MM/DD/YYYY"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'dateBenchOpinionRendered',
                section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-2">
          <div style={{ marginBottom: '28px' }}></div>
          <FormGroup className="margin-bottom-0 display-inline-block">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={trialBriefFormState.transcriptOrdered}
                className="usa-checkbox__input"
                id="trialBriefTranscriptOrdered"
                name="trialBriefTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'transcriptOrdered',
                    section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-bottom-0"
                htmlFor="trialBriefTranscriptOrdered"
              >
                Transcript Ordered
              </label>
            </div>
          </FormGroup>
        </div>
        <div className="grid-col-3">
          <label className="usa-label margin-right-2" htmlFor="trialBriefNote">
            Note
          </label>
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <input
              className="usa-input display-inline-block"
              id="trialBriefNote"
              name="trialBriefNote"
              type="text"
              value={trialBriefFormState.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'note',
                  section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-2">
          <label
            className="margin-right-2 display-inline-block"
            htmlFor="briefType"
          >
            Brief type
          </label>
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <select
              className="usa-select display-inline-block"
              id="briefType"
              name="briefType"
              value={trialBriefFormState.briefType}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'briefType',
                  section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
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
