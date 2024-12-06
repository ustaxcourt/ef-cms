import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OnChangeHandler } from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import {
  PARTY_TYPE_OPTIONS_MAP,
  SeriatimBriefFormFields,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const SeriatimBriefFieldset = ({
  onBlurHandler,
  onChangeHandler,
  seriatimBriefFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  seriatimBriefFormState: SeriatimBriefFormFields;
}) => {
  const rowsConfig = [
    { key: 'opening', rowLabel: 'Opening' },
    { key: 'answering', rowLabel: 'Answering' },
    { key: 'reply', rowLabel: 'Reply' },
    { key: 'surReply', rowLabel: 'Sur-reply' },
  ];

  return (
    <fieldset className="border-0 grid-container padding-0">
      {rowsConfig.map(rowConfig => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={rowConfig.key}
          >
            <div className="grid-col-1">
              <span className="usa-label margin-bottom-0">
                {rowConfig.rowLabel}
              </span>
            </div>
            <div className="grid-col-3">
              <FormGroup className="margin-bottom-0">
                <div>
                  {Object.entries(PARTY_TYPE_OPTIONS_MAP).map(
                    ([key, value]) => (
                      <div className="usa-radio usa-radio__inline" key={key}>
                        <input
                          checked={
                            seriatimBriefFormState[rowConfig.key].partyType ===
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
                              section: 'trialBrief',
                              value: e.target.value,
                            })
                          }
                        />
                        <label
                          aria-label={value}
                          className="smaller-padding-right usa-radio__label"
                          htmlFor={`${key}-${rowConfig.key}PartyType`}
                          id={`${key}-party-type-label`}
                        >
                          {value}
                        </label>
                      </div>
                    ),
                  )}
                </div>{' '}
              </FormGroup>
            </div>
            <div className="grid-col-4">
              <DateSelector
                defaultValue={undefined}
                formGroupClassNames="margin-bottom-0"
                id={`${rowConfig.key}DueDate`}
                label="Date"
                labelPosition="left"
                onChange={e =>
                  onChangeHandler({
                    name: 'briefDetails',
                    rowInfo: {
                      key: rowConfig.key,
                      nestedName: 'dueDate',
                    },
                    section: 'trialBrief',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid-col-4">
              <FormGroup className="margin-bottom-0 display-flex align-items-center">
                <label
                  className="margin-right-2 margin-bottom-0 display-inline-block"
                  htmlFor={`${rowConfig.key}Note`}
                >
                  Note
                </label>
                <input
                  className="usa-input"
                  id={`${rowConfig.key}Note`}
                  name={`${rowConfig.key}Note`}
                  type="text"
                  value={seriatimBriefFormState[rowConfig.key].note}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'briefDetails',
                      rowInfo: {
                        key: rowConfig.key,
                        nestedName: 'note',
                      },
                      section: 'trialBrief',
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
};
