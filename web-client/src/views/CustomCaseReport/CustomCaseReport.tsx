import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useState } from 'react';

export const CustomCaseReport = connect(
  {
    customCaseInventoryReportHelper: state.customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence:
      sequences.getCustomCaseInventoryReportSequence,
    selectDateRangeForCustomCaseReportSequence:
      sequences.selectDateRangeForCustomCaseReportSequence,
  },
  function CustomCaseReport({
    // customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence,
    selectDateRangeForCustomCaseReportSequence,
  }) {
    const [selected] = useState(false);

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Custom Case Report</h1>
          </div>
          <div className="grid-col-4">
            <DateRangePickerComponent
              endDateOptional={false}
              endLabel="Case created end date"
              endName="caseCreationEndDate"
              endValue=""
              orientation="horizontal"
              startDateOptional={false}
              startLabel="Case created start date"
              startName="caseCreationStartDate"
              startValue=""
              onChangeEnd={e => {
                selectDateRangeForCustomCaseReportSequence({
                  date: e.target.value,
                  startOrEnd: 'end',
                });
              }}
              onChangeStart={e => {
                selectDateRangeForCustomCaseReportSequence({
                  date: e.target.value,
                  startOrEnd: 'start',
                });
              }}
            />
          </div>
          <div className="grid-col-6">
            <legend>Petition Filing Method</legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={selected}
                className="usa-radio__input"
                id="petitionFilingMethod-all"
                name="petitionFilingMethod"
                type="radio"
                value="all"
                // onChange={handleChange}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-all"
              >
                All
              </label>
            </div>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={selected}
                className="usa-radio__input"
                id="petitionFilingMethod-electronic"
                name="petitionFilingMethod"
                type="radio"
                value="electronic"
                // onChange={handleChange}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-electronic"
              >
                Electronic
              </label>
            </div>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={selected}
                className="usa-radio__input"
                id="petitionFilingMethod-paper"
                name="petitionFilingMethod"
                type="radio"
                value="paper"
                // onChange={handleChange}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-paper"
              >
                Paper
              </label>
            </div>
          </div>
          <Button
            // disabled={
            //   customCaseInventoryReportHelper.disableCustomCaseReportButton
            // }

            onClick={() => getCustomCaseInventoryReportSequence()}
          >
            Run Report
          </Button>
        </section>
      </>
    );
  },
);

CustomCaseReport.displayName = 'CustomCaseReport';
