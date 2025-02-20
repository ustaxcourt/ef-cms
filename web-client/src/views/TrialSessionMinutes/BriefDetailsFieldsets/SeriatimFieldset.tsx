import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  PARTY_TYPE_OPTIONS_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';
import {
  SeriatimBrief,
  SeriatimMemorandum,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const SeriatimFieldset = ({
  onBlurHandler,
  onChangeHandler,
  seriatimFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  seriatimFormState: SeriatimBrief | SeriatimMemorandum;
}) => {
  const rowsConfig = [
    { key: 'opening', rowLabel: 'Opening' },
    { key: 'answering', rowLabel: 'Answering' },
    { key: 'reply', rowLabel: 'Reply' },
    { key: 'surReply', rowLabel: 'Sur-reply' },
  ];

  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap align-items-center">
        <div className="grid-col-1"></div>
        <div className="grid-col-3">
          <div className="grid-row">
            <div className="grid-col-6 text-center">
              <span className="usa-label">Petitioner</span>
            </div>
            <div className="grid-col-6 text-center">
              <span className="usa-label">Respondent</span>
            </div>
          </div>
        </div>
        <div className="grid-col-4">
          <span className="usa-label">Date due</span>
        </div>
        <div className="grid-col-4">
          <span className="usa-label">Note</span>
        </div>
      </div>
      {rowsConfig.map((rowConfig, index) => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={rowConfig.key}
          >
            <div className="grid-col-1">
              <span className="margin-bottom-0">{rowConfig.rowLabel}</span>
            </div>
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <div className="grid-row align-items-center">
                  {Object.entries(PARTY_TYPE_OPTIONS_MAP).map(
                    ([key, value]) => (
                      <div className="grid-col-6 text-center" key={key}>
                        <div className="usa-radio usa-radio__inline">
                          <input
                            checked={
                              seriatimFormState[rowConfig.key].partyType ===
                              value
                            }
                            className="usa-radio__input"
                            id={`${key}-${rowConfig.key}PartyType`}
                            name={`${rowConfig.key}PartyType`}
                            type="radio"
                            value={value}
                            onBlur={() => onBlurHandler()}
                            onChange={e =>
                              onChangeHandler({
                                name: 'briefDetails',
                                rowInfo: {
                                  key: rowConfig.key,
                                  nestedName: 'partyType',
                                },
                                section:
                                  MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            aria-label={value}
                            className="usa-radio__label padding-left-0"
                            htmlFor={`${key}-${rowConfig.key}PartyType`}
                            id={`${key}-party-type-label`}
                          ></label>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </FormGroup>
            </div>
            <div className="grid-col-4">
              <DateSelector
                formatDateOnChange
                defaultValue={seriatimFormState[rowConfig.key].dueDate}
                formGroupClassNames="margin-bottom-0"
                id={`${rowConfig.key}DueDate`}
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'briefDetails',
                    rowInfo: {
                      key: rowConfig.key,
                      nestedName: 'dueDate',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid-col-4">
              <div className="padding-right-4">
                <FormGroup className="margin-bottom-0 display-flex align-items-center">
                  <input
                    className="usa-input"
                    id={`${rowConfig.key}Note`}
                    aria-label={`Note-${index}`}
                    name={`${rowConfig.key}Note`}
                    type="text"
                    value={seriatimFormState[rowConfig.key].note}
                    onBlur={() => onBlurHandler()}
                    onChange={e =>
                      onChangeHandler({
                        name: 'briefDetails',
                        rowInfo: {
                          key: rowConfig.key,
                          nestedName: 'note',
                        },
                        section:
                          MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection,
                        value: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
};
