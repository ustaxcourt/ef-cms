import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
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
  return (
    <fieldset className="border-0 padding-0">
      <div className="grid-row grid-gap-2">
        <div className="grid-col-auto usa-label" style={{ minWidth: '266px' }}>
          Date
        </div>
        <div className="grid-col-2 usa-label">Document Type</div>
        <div className="grid-col-2 usa-label">Filed By</div>
        <div className="grid-col-2 usa-label">Status</div>
        <div className="grid-col-fill usa-label">Description/Note</div>
      </div>
      {Object.values(actionsAndFilingsFormState.actionsAndFilings).map(row => {
        return (
          <div
            className="grid-row grid-gap-2 align-items-center margin-bottom-1"
            key={row.renderKey}
          >
            <div className="grid-col-auto">
              <DateSelector
                defaultValue={row.date}
                formGroupClassNames="margin-bottom-0"
                id={`actionsAndFilingsDate-${row.renderKey}`}
                labelPosition="hidden"
                onChange={e =>
                  onChangeHandler({
                    name: 'actionsAndFilings',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'date',
                    },
                    section: 'actionsAndFilingsSection',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <label
                  hidden
                  htmlFor={`actionsAndFilingsDocumentType-${row.renderKey}`}
                >
                  Document Type
                </label>
                <select
                  className="usa-select display-inline-block"
                  id={`actionsAndFilingsDocumentType-${row.renderKey}`}
                  name={`actionsAndFilingsDocumentType-${row.renderKey}`}
                  value={row.documentType}
                  onBlur={() => onBlurHandler()}
                  onChange={e => {
                    onChangeHandler({
                      name: 'actionsAndFilings',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'documentType',
                      },
                      section: 'actionsAndFilingsSection',
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  {Object.keys(ACTION_DOCUMENT_TYPE_OPTIONS).map(optionKey => {
                    return (
                      <option
                        key={`${optionKey}-${row.renderKey}`}
                        value={optionKey}
                      >
                        {ACTION_DOCUMENT_TYPE_OPTIONS[optionKey]}
                      </option>
                    );
                  })}
                </select>
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <label
                  hidden
                  htmlFor={`actionsAndFilingsFiledBy-${row.renderKey}`}
                >
                  Filed by
                </label>
                <select
                  className="usa-select display-inline-block"
                  id={`actionsAndFilingsFiledBy-${row.renderKey}`}
                  name={`actionsAndFilingsFiledBy-${row.renderKey}`}
                  value={row.filedBy}
                  onBlur={() => onBlurHandler()}
                  onChange={e => {
                    onChangeHandler({
                      name: 'actionsAndFilings',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'filedBy',
                      },
                      section: 'actionsAndFilingsSection',
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  {Object.keys(ACTION_FILED_BY_OPTIONS).map(optionKey => {
                    return (
                      <option
                        key={`${optionKey}-${row.renderKey}`}
                        value={optionKey}
                      >
                        {ACTION_FILED_BY_OPTIONS[optionKey]}
                      </option>
                    );
                  })}
                </select>
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <label
                  hidden
                  htmlFor={`actionsAndFilingsStatus-${row.renderKey}`}
                >
                  Status
                </label>
                <select
                  className="usa-select display-inline-block"
                  id={`actionsAndFilingsStatus-${row.renderKey}`}
                  name={`actionsAndFilingsStatus-${row.renderKey}`}
                  value={row.status}
                  onBlur={() => onBlurHandler()}
                  onChange={e => {
                    onChangeHandler({
                      name: 'actionsAndFilings',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'status',
                      },
                      section: 'actionsAndFilingsSection',
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  {Object.keys(ACTION_STATUS_OPTIONS).map(optionKey => {
                    return (
                      <option
                        key={`${optionKey}-${row.renderKey}`}
                        value={optionKey}
                      >
                        {ACTION_STATUS_OPTIONS[optionKey]}
                      </option>
                    );
                  })}
                </select>
              </FormGroup>
            </div>
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
                      section: 'actionsAndFilingsSection',
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
                    section: 'actionsAndFilingsSection',
                  });
                }}
              >
                Remove
              </Button>
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
                name: 'actionsAndFilings',
                section: 'actionsAndFilingsSection',
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
