import {
  AddRowHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  MOTION_FILED_BY_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_TYPE_OPTIONS,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const MotionsFieldset = ({
  addRowHandler,
  motionsFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  onBlurHandler: () => void;
  motionsFormState: MinuteSheetFormState['motionsSection'];
}) => {
  return (
    <fieldset className="border-0 padding-0">
      {Object.values(motionsFormState.motions).map(row => {
        return (
          <div className="margin-bottom-3" key={row.renderKey}>
            <div className="grid-row grid-gap align-items-center margin-bottom-1">
              <div className="grid-col-auto">
                <DateSelector
                  formatDateOnChange
                  defaultValue={row.date}
                  formGroupClassNames="margin-bottom-0"
                  id={`motionFiledDate-${row.renderKey}`}
                  label="Date"
                  labelPosition="left"
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'motions',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'date',
                      },
                      section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid-col-3">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <label
                    className="margin-right-2 margin-bottom-0 display-inline-block"
                    htmlFor={`motionType-${row.renderKey}`}
                  >
                    Type
                  </label>
                  <select
                    className="usa-select display-inline-block"
                    id={`motionType-${row.renderKey}`}
                    name={`motionType-${row.renderKey}`}
                    value={row.type}
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'motions',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'type',
                        },
                        section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="">- Select -</option>
                    {Object.keys(MOTION_TYPE_OPTIONS).map(optionKey => {
                      return (
                        <option
                          key={`${optionKey}-${row.renderKey}`}
                          value={optionKey}
                        >
                          {MOTION_TYPE_OPTIONS[optionKey]}
                        </option>
                      );
                    })}
                  </select>
                </FormGroup>
              </div>
              <div className="grid-col-fill">
                <FormGroup className="margin-bottom-0 display-flex align-items-center">
                  <div className="usa-checkbox">
                    <input
                      checked={row.oralMotion}
                      className="usa-checkbox__input"
                      id={`motionOralMotion${row.renderKey}`}
                      name={`motionOralMotion${row.renderKey}`}
                      type="checkbox"
                      onBlur={() => onBlurHandler()}
                      onChange={e => {
                        onChangeHandler({
                          name: 'motions',
                          rowInfo: {
                            key: row.renderKey,
                            nestedName: 'oralMotion',
                          },
                          section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                          value: e.target.checked,
                        });
                      }}
                    />
                    <label
                      className="usa-checkbox__label margin-0"
                      htmlFor={`motionOralMotion${row.renderKey}`}
                    >
                      Oral motion
                    </label>
                  </div>
                </FormGroup>
              </div>
            </div>
            <div className="grid-row grid-gap align-items-center margin-bottom-1">
              <div className="grid-col-3">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <label
                    className="margin-right-2 margin-bottom-0 display-inline-block no-wrap"
                    htmlFor={`motionFiledBy-${row.renderKey}`}
                  >
                    Filed by
                  </label>
                  <select
                    className="usa-select display-inline-block"
                    id={`motionFiledBy-${row.renderKey}`}
                    name={`motionFiledBy-${row.renderKey}`}
                    value={row.filedBy}
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'motions',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'filedBy',
                        },
                        section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="">- Select -</option>
                    {Object.keys(MOTION_FILED_BY_OPTIONS).map(optionKey => {
                      return (
                        <option
                          key={`${optionKey}-${row.renderKey}`}
                          value={optionKey}
                        >
                          {MOTION_FILED_BY_OPTIONS[optionKey]}
                        </option>
                      );
                    })}
                  </select>
                </FormGroup>
              </div>
              <div className="grid-col-3">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <label
                    className="margin-right-2 margin-bottom-0 display-inline-block"
                    htmlFor={`motionStatus-${row.renderKey}`}
                  >
                    Status
                  </label>
                  <select
                    className="usa-select display-inline-block"
                    id={`motionStatus-${row.renderKey}`}
                    name={`motionStatus-${row.renderKey}`}
                    value={row.status}
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'motions',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'status',
                        },
                        section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="">- Select -</option>
                    {Object.keys(MOTION_STATUS_OPTIONS).map(optionKey => {
                      return (
                        <option
                          key={`${optionKey}-${row.renderKey}`}
                          value={optionKey}
                        >
                          {MOTION_STATUS_OPTIONS[optionKey]}
                        </option>
                      );
                    })}
                  </select>
                </FormGroup>
              </div>
              <div className="grid-col-6">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <label
                    className="margin-right-2 margin-bottom-0 display-inline-block"
                    htmlFor={`motionNote${row.renderKey}`}
                  >
                    Note
                  </label>
                  <input
                    className="usa-input display-inline-block maxw-full"
                    id={`motionNote${row.renderKey}`}
                    name={`motionNote${row.renderKey}`}
                    type="text"
                    value={row.note}
                    onBlur={() => onBlurHandler()}
                    onChange={e =>
                      onChangeHandler({
                        name: 'motions',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'note',
                        },
                        section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
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
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-auto">
          <Button
            link
            className="padding-0"
            icon="plus"
            onClick={e => {
              e.preventDefault();
              addRowHandler({
                name: 'motions',
                section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
              });
            }}
          >
            Add Motion to Dismiss/Motion for Continuance
          </Button>
        </div>
      </div>
    </fieldset>
  );
};
