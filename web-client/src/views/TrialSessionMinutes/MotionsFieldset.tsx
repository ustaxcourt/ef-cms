import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  MOTION_FILED_BY_OPTIONS,
  MOTION_OBJECTION_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_TYPE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const MotionsFieldset = ({
  addRowHandler,
  motionsFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  motionsFormState: MinuteSheetFormState['motionsSection'];
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="usa-label">
        Motion to Dismiss / Motion for Continuance
      </div>
      {Object.values(motionsFormState.motions).map((row, rowIndex) => {
        return (
          <div className="margin-bottom-3" key={row.renderKey}>
            <div className="grid-row grid-gap align-items-center margin-bottom-1">
              <div className="grid-col-auto">
                <DateSelector
                  formatDateOnChange
                  placeHolderText="MM/DD/YYYY"
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
                    data-testid={`motion-type-${rowIndex}`}
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
                      data-testid={`motion-oral-${rowIndex}`}
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
            <div className="grid-row grid-gap-2 align-items-center margin-bottom-1">
              <div className="grid-col-2">
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
                    data-testid={`motion-filed-by-${rowIndex}`}
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
              <div className="grid-col-2">
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
                    data-testid={`motion-status-${rowIndex}`}
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
              <div className="grid-col-2">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <label
                    className="margin-right-2 margin-bottom-0 display-inline-block"
                    htmlFor={`motionObjection-${row.renderKey}`}
                  >
                    Objection
                  </label>
                  <select
                    className="usa-select display-inline-block"
                    id={`motionObjection-${row.renderKey}`}
                    data-testid={`motion-objection-${rowIndex}`}
                    name={`motionObjection-${row.renderKey}`}
                    value={row.objection}
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'motions',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'objection',
                        },
                        section: MINUTE_SHEET_FORM_SECTION_MAP.motionsSection,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="">- Select -</option>
                    {Object.keys(MOTION_OBJECTION_OPTIONS).map(optionKey => {
                      return (
                        <option
                          key={`${optionKey}-${row.renderKey}`}
                          value={optionKey}
                        >
                          {MOTION_OBJECTION_OPTIONS[optionKey]}
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
                    data-testid={`motion-note-${rowIndex}`}
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
            data-testid="add-motion-button"
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
