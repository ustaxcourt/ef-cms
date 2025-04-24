import {
  KeyedActionFilingFormFields,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  MINUTE_SHEET_FORM_SECTION_MAP,
  MOTION_OBJECTION_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import React from 'react';
import { reactSelectValue } from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export const ActionsAndFilingsFieldset = ({
  trialSessionMinutesHelper,
  actionsAndFilingsFormState,
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  removeRowHandler: RemoveRowHandler;
  onBlurHandler: AutoSaveHandler;
  trialSessionMinutesHelper: any;
  actionsAndFilingsFormState: MinuteSheetFormState['actionsAndFilingsSection'];
}) => {
  const renderSelectField = (
    id: string,
    name: string,
    value: string,
    options: Record<string, string>,
    row: KeyedActionFilingFormFields,
    nestedName: string,
  ) => (
    <FormGroup className="display-flex align-items-center maxw-full margin-bottom-0">
      <select
        className="usa-select display-inline-block"
        aria-label={id}
        id={id}
        name={name}
        value={value}
        onBlur={() => onBlurHandler()}
        onChange={e => {
          onChangeHandler({
            name: 'actionsAndFilings',
            rowInfo: {
              key: row.renderKey,
              nestedName,
            },
            section: MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
            value: e.target.value,
          });
        }}
      >
        <option value="">- Select -</option>
        {Object.keys(options).map(optionKey => (
          <option key={optionKey} value={optionKey}>
            {options[optionKey]}
          </option>
        ))}
      </select>
    </FormGroup>
  );

  const getFieldsByRow = (row: KeyedActionFilingFormFields, rowIndex) => {
    return (
      <>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <input
              className="usa-input display-inline-block maxw-full"
              id={`actionsAndFilingsDate-${row.renderKey}`}
              aria-label={`actionsAndFilingsDate-${rowIndex}`}
              data-testid={`actionsAndFilingsDate-${row.renderKey}`}
              name={`actionsAndFilingsDate-${row.renderKey}`}
              type="text"
              value={row.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'actionsAndFilings',
                  rowInfo: {
                    key: row.renderKey,
                    nestedName: 'date',
                  },
                  section:
                    MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          {renderSelectField(
            `actionsAndFilingsFiledBy-${rowIndex}`,
            'Filed by',
            row.filedBy,
            ACTION_FILED_BY_OPTIONS,
            row,
            'filedBy',
          )}
        </div>
        <div className="grid-col-2">
          <SelectSearch
            aria-label="actions-and-filings-document-type-label"
            data-testid="actions-and-filings-document-type-search"
            isDisabled={!row.filedBy}
            id="actions-and-filings-document-type"
            isClearable={true}
            isMulti={false}
            name="eventCode"
            options={
              trialSessionMinutesHelper.documentTypeOptions[row.renderKey]
            }
            value={reactSelectValue({
              documentTypes:
                trialSessionMinutesHelper.documentTypeOptions[row.renderKey],
              selectedEventCode: row.documentType,
            })}
            onChange={inputValue => {
              const value = inputValue?.value || '';
              console.log(`Selected value: ${value}`);
              onChangeHandler({
                name: 'actionsAndFilings',
                rowInfo: {
                  key: row.renderKey,
                  nestedName: 'documentType',
                },
                section: MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                value,
              });
              return true;
            }}
            onBlur={() => onBlurHandler()}
          />
        </div>
        <div className="grid-col-2">
          {renderSelectField(
            `actionsAndFilingsStatus-${rowIndex}`,
            'Status',
            row.status,
            ACTION_STATUS_OPTIONS,
            row,
            'status',
          )}
        </div>
      </>
    );
  };

  const getMotionDetailsByRow = (
    row: KeyedActionFilingFormFields,
    rowIndex,
  ) => {
    if (DocketEntry.isMotion(row.documentType)) {
      return (
        <div className="grid-row grid-gap-2 align-items-right margin-bottom-1">
          <div className="grid-col-6"></div>
          <div className="grid-col-2 margin-left-4">
            <FormGroup className="margin-bottom-0">
              <div className="usa-checkbox">
                <input
                  checked={row.oralMotion}
                  className="usa-checkbox__input"
                  id={`actionsAndFilingsOralMotion${row.renderKey}`}
                  aria-label={`actionsAndFilingsOralMotion-${rowIndex}`}
                  name={`actionsAndFilingsOralMotion${row.renderKey}`}
                  type="checkbox"
                  onBlur={() => onBlurHandler()}
                  onChange={e => {
                    onChangeHandler({
                      name: 'actionsAndFilings',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'oralMotion',
                      },
                      section:
                        MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor={`actionsAndFilingsOralMotion${row.renderKey}`}
                >
                  Oral motion
                </label>
              </div>
            </FormGroup>
          </div>
          <div className="grid-col-fill">
            <FormGroup className="margin-bottom-0 display-flex align-items-center">
              <label
                className="margin-right-2 margin-bottom-0 display-inline-block"
                htmlFor={`actionsAndFilingsObjection-${row.renderKey}`}
              >
                Objection
              </label>
              <select
                className="usa-select display-inline-block"
                aria-label={`actionsAndFilingsObjection-${rowIndex}`}
                id={`actionsAndFilingsObjection-${row.renderKey}`}
                name={`actionsAndFilingsObjection-${row.renderKey}`}
                value={row.objection}
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'actionsAndFilings',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'objection',
                    },
                    section:
                      MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                {Object.keys(MOTION_OBJECTION_OPTIONS).map(optionKey => (
                  <option key={optionKey} value={optionKey}>
                    {MOTION_OBJECTION_OPTIONS[optionKey]}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>
          <div className="grid-col-1"></div>
        </div>
      );
    }
  };

  return (
    <fieldset className="border-0 padding-0">
      <div className="usa-label">Actions & Filings</div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-2 usa-label">Date</div>
        <div className="grid-col-2 usa-label">Filed By</div>
        <div className="grid-col-2 usa-label">Document Type</div>
        <div className="grid-col-2 usa-label">Status</div>
        <div className="grid-col-fill usa-label">Description/Note</div>
      </div>
      {Object.values(actionsAndFilingsFormState.actionsAndFilings).map(
        (row, rowIndex) => (
          <React.Fragment key={row.renderKey}>
            <div className="grid-row grid-gap-2 align-items-center margin-bottom-1">
              {getFieldsByRow(row, rowIndex)}
              <div className="grid-col-fill">
                <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                  <input
                    className="usa-input display-inline-block maxw-full"
                    id={`actionsAndFilingsNote-${rowIndex}`}
                    aria-label={`actionsAndFilingsNote-${rowIndex}`}
                    name={`actionsAndFilingsNote-${rowIndex}`}
                    type="text"
                    value={row.note}
                    onBlur={() => onBlurHandler()}
                    onChange={e =>
                      onChangeHandler({
                        name: 'actionsAndFilings',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'note',
                        },
                        section:
                          MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                        value: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </div>
              <div className="grid-col-1">
                <Button
                  link
                  className="padding-0"
                  icon="times"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    removeRowHandler({
                      key: row.renderKey,
                      name: 'actionsAndFilings',
                      section:
                        MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
            {getMotionDetailsByRow(row, rowIndex)}
          </React.Fragment>
        ),
      )}
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-auto">
          <Button
            link
            className="padding-0"
            icon="plus"
            type="button"
            onClick={e => {
              e.preventDefault();
              addRowHandler({
                name: 'actionsAndFilings',
                section: MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
              });
            }}
          >
            Add Action/Filing
          </Button>
        </div>
      </div>
    </fieldset>
  );
};
