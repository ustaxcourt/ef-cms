import { BigHeader } from '../BigHeader';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import React, { useState } from 'react';

export const CustomCaseReport = connect({}, function CustomCaseReport() {
  // let selected = false;
  const handleChange = event => {
    console.log('Yo its me event: ', event);
  };
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
            endLabel="Case created end date"
            orientation="horizontal"
            startLabel="Case created start date"
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
            <label
              className="usa-radio__label"
              htmlFor="petitionFilingMethod-paper"
            >
              Paper
            </label>
          </div>
        </div>
      </section>
    </>
  );
});

CustomCaseReport.displayName = 'CustomCaseReport';
