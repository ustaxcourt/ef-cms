import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  ActionDocumentTypeOption,
  KeyedActionFilingFormFields,
  MINUTE_SHEET_FORM_SECTION_MAP,
  MinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  AddRowHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MOTION_OBJECTION_OPTIONS } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const ActionsAndFilingsFieldset = ({
  actionsAndFilingsFormState,
  addRowHandler,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  removeRowHandler: RemoveRowHandler;
  onBlurHandler: () => void;
  actionsAndFilingsFormState: MinuteSheetFormState['actionsAndFilingsSection'];
}) => {
  const SHOW_MOTION_DETAILS_TYPE: ActionDocumentTypeOption = 'motion';

  const renderSelectField = (
    id: string,
    name: string,
    value: string,
    options: Record<string, string>,
    row: KeyedActionFilingFormFields,
    nestedName: string,
  ) => (
    <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
      <label hidden htmlFor={id}>
        {name}
      </label>
      <select
        className="usa-select display-inline-block"
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

  const getFieldsByRow = (row: KeyedActionFilingFormFields) => {
    const editableRow = (
      <>
        <div className="grid-col-auto">
          <DateSelector
            formatDateOnChange
            defaultValue={row.date}
            formGroupClassNames="margin-bottom-0"
            id={`actionsAndFilingsDate-${row.renderKey}`}
            labelPosition="hidden"
            onBlur={() => onBlurHandler()}
            onChange={e =>
              onChangeHandler({
                name: 'actionsAndFilings',
                rowInfo: {
                  key: row.renderKey,
                  nestedName: 'date',
                },
                section: MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection,
                value: e.target.value,
              })
            }
          />
        </div>
        <div className="grid-col-2">
          {renderSelectField(
            `actionsAndFilingsDocumentType-${row.renderKey}`,
            'Document Type',
            row.documentType,
            ACTION_DOCUMENT_TYPE_OPTIONS,
            row,
            'documentType',
          )}
        </div>
        <div className="grid-col-2">
          {renderSelectField(
            `actionsAndFilingsFiledBy-${row.renderKey}`,
            'Filed by',
            row.filedBy,
            ACTION_FILED_BY_OPTIONS,
            row,
            'filedBy',
          )}
        </div>
        <div className="grid-col-2">
          {renderSelectField(
            `actionsAndFilingsStatus-${row.renderKey}`,
            'Status',
            row.status,
            ACTION_STATUS_OPTIONS,
            row,
            'status',
          )}
        </div>
      </>
    );

    const nonEditableRow = (
      <>
        <div className="grid-col-auto" style={{ minWidth: '266px' }}>
          {row.date}
        </div>
        <div className="grid-col-2">
          {ACTION_DOCUMENT_TYPE_OPTIONS[row.documentType]}
        </div>
        <div className="grid-col-2">
          {ACTION_FILED_BY_OPTIONS[row.filedBy]}{' '}
        </div>
        <div className="grid-col-2">{ACTION_STATUS_OPTIONS[row.status]}</div>
      </>
    );

    return row.isOnDocketRecord ? nonEditableRow : editableRow;
  };

  const getMotionDetailsByRow = (row: KeyedActionFilingFormFields) => {
    if (row.documentType === SHOW_MOTION_DETAILS_TYPE) {
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
        <div className="grid-col-auto usa-label" style={{ minWidth: '266px' }}>
          Date
        </div>
        <div className="grid-col-2 usa-label">Document Type</div>
        <div className="grid-col-2 usa-label">Filed By</div>
        <div className="grid-col-2 usa-label">Status</div>
        <div className="grid-col-fill usa-label">Description/Note</div>
      </div>
      {Object.values(actionsAndFilingsFormState.actionsAndFilings).map(row => (
        <React.Fragment key={row.renderKey}>
          <div className="grid-row grid-gap-2 align-items-center margin-bottom-1">
            {getFieldsByRow(row)}
            <div className="grid-col-fill">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <label hidden htmlFor={`actionsAndFilingsNote${row.renderKey}`}>
                  Description/Note
                </label>
                <input
                  className="usa-input display-inline-block maxw-full"
                  id={`actionsAndFilingsNote${row.renderKey}`}
                  name={`actionsAndFilingsNote${row.renderKey}`}
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
          {getMotionDetailsByRow(row)}
        </React.Fragment>
      ))}
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-auto">
          <Button
            link
            className="padding-0"
            icon="plus"
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
