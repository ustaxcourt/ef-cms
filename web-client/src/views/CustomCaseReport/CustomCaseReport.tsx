import { BigHeader } from '../BigHeader';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const CustomCaseReport = connect({}, function CustomCaseReport() {
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
          <DateRangePickerComponent />
        </div>
      </section>
    </>
  );
});

CustomCaseReport.displayName = 'CustomCaseReport';
