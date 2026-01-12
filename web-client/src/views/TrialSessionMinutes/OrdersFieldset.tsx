import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import React from 'react';

export const OrdersFieldset = ({
  onBlurHandler,
  onChangeHandler,
  ordersFormState,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  ordersFormState: MinuteSheetFormState['ordersSection'];
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap-2 align-items-center margin-bottom-1">
        <legend className="usa-legend grid-col-2 margin-bottom-0">
          Status Report ordered
        </legend>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="statusReportOrderedDate"
            >
              Date
            </label>
            <input
              className="usa-input unset-width display-inline-block"
              id="statusReportOrderedDate"
              data-testid="statusReportOrderedDate"
              name="statusReportOrderedDate"
              type="text"
              value={ordersFormState.statusReportOrdered.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'statusReportOrdered',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="statusReportOrderedDueDate"
            >
              Date due
            </label>
            <input
              className="usa-input unset-width display-inline-block"
              id="statusReportOrderedDueDate"
              data-testid="statusReportOrderedDueDate"
              name="statusReportOrderedDueDate"
              type="text"
              value={ordersFormState.statusReportOrdered.dueDate}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'statusReportOrdered',
                  rowInfo: {
                    key: 'dueDate',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor={'statusReportOrderedFor'}
            >
              Ordered for
            </label>
            <select
              className="usa-select display-inline-block"
              id="statusReportOrderedFor"
              name="statusReportOrderedFor"
              value={ordersFormState.statusReportOrdered.orderedFor}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'statusReportOrdered',
                  rowInfo: {
                    key: 'orderedFor',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {Object.keys(STATUS_REPORT_ORDERED_FOR_OPTIONS).map(optionKey => {
                return (
                  <option key={optionKey} value={optionKey}>
                    {STATUS_REPORT_ORDERED_FOR_OPTIONS[optionKey]}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor={'statusReportOrderedNote'}
            >
              Note
            </label>
            <input
              className="usa-input maxw-full"
              id="statusReportOrderedNote"
              name="statusReportOrderedNote"
              type="text"
              value={ordersFormState.statusReportOrdered.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'statusReportOrdered',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap-2 align-items-center">
        <legend className="usa-legend grid-col-2 margin-bottom-0">
          Stipulated Decision ordered
        </legend>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="stipulatedDecisionOrderedDate"
            >
              Date
            </label>
            <input
              className="usa-input unset-width display-inline-block"
              id="stipulatedDecisionOrderedDate"
              data-testid="stipulatedDecisionOrderedDate"
              name="stipulatedDecisionOrderedDate"
              type="text"
              value={ordersFormState.stipulatedDecisionOrdered.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'stipulatedDecisionOrdered',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="stipulatedDecisionOrderedDueDate"
            >
              Date due
            </label>
            <input
              className="usa-input unset-width display-inline-block"
              id="stipulatedDecisionOrderedDueDate"
              data-testid="stipulatedDecisionOrderedDueDate"
              name="stipulatedDecisionOrderedDueDate"
              type="text"
              value={ordersFormState.stipulatedDecisionOrdered.dueDate}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'stipulatedDecisionOrdered',
                  rowInfo: {
                    key: 'dueDate',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-fill">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor={'stipulatedDecisionOrderedNote'}
            >
              Note
            </label>
            <input
              className="usa-input maxw-full"
              id="stipulatedDecisionOrderedNote"
              name="stipulatedDecisionOrderedNote"
              type="text"
              value={ordersFormState.stipulatedDecisionOrdered.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'stipulatedDecisionOrdered',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.ordersSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
      </div>
    </fieldset>
  );
};
