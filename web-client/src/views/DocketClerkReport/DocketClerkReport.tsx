import { BigHeader } from '../BigHeader';
import { BindedSelect } from '@web-client/ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketClerkReportDocumentQc } from './DocketClerkReportDocumentQc';
import { DocketClerkReportMessages } from './DocketClerkReportMessages';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocketClerkReport = connect(
  {
    docketClerkReportHelper: state.docketClerkReportHelper,
    runDocketClerkReportSequence: sequences.runDocketClerkReportSequence,
  },
  function DocketClerkReport({
    docketClerkReportHelper,
    runDocketClerkReportSequence,
  }) {
    const { errors } = docketClerkReportHelper;

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Docket Clerk Report</h1>
          </div>

          <div className="grid-row grid-gap flex-align-end">
            <div className="grid-col-auto">
              <div className="usa-form-group margin-bottom-0 tw:relative">
                <label className="usa-label" htmlFor="docket-clerk">
                  Docket Clerk
                </label>
                <BindedSelect
                  aria-label="docket clerk"
                  bind="docketClerkReport.form.docketClerkUserId"
                  className={classNames(
                    'width-15rem',
                    'tw:rounded-md!',
                    errors?.docketClerkUserId &&
                      'tw:border-2! tw:border-solid! tw:border-[#b50909]!',
                  )}
                  data-testid="docket-clerk-report-clerk-select"
                  id="docket-clerk"
                  name="docketClerkUserId"
                >
                  <option value="">-- Select --</option>
                  {docketClerkReportHelper.docketClerkOptions.map(clerk => (
                    <option key={clerk.userId} value={clerk.userId}>
                      {clerk.name}
                    </option>
                  ))}
                </BindedSelect>
                {errors?.docketClerkUserId && (
                  <span
                    className="usa-error-message tw:absolute! tw:top-full! tw:left-0! tw:whitespace-nowrap!"
                    data-testid="docket-clerk-report-clerk-error"
                  >
                    <FontAwesomeIcon
                      className="margin-right-05"
                      icon="exclamation-circle"
                    />
                    {errors.docketClerkUserId}
                  </span>
                )}
              </div>
            </div>

            <div className="grid-col-auto">
              <div className="usa-form-group margin-bottom-0 tw:relative">
                <label className="usa-label" htmlFor="page-type">
                  Page Type
                </label>
                <BindedSelect
                  aria-label="page type"
                  bind="docketClerkReport.form.pageType"
                  className={classNames(
                    'width-15rem',
                    'tw:rounded-md!',
                    errors?.pageType &&
                      'tw:border-2! tw:border-solid! tw:border-[#b50909]!',
                  )}
                  data-testid="docket-clerk-report-page-type-select"
                  id="page-type"
                  name="pageType"
                >
                  <option value="">-- Select --</option>
                  {docketClerkReportHelper.pageTypeOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </BindedSelect>
                {errors?.pageType && (
                  <span
                    className="usa-error-message tw:absolute! tw:top-full! tw:left-0! tw:whitespace-nowrap!"
                    data-testid="docket-clerk-report-page-type-error"
                  >
                    <FontAwesomeIcon
                      className="margin-right-05"
                      icon="exclamation-circle"
                    />
                    {errors.pageType}
                  </span>
                )}
              </div>
            </div>

            <div className="grid-col-auto">
              <Button
                data-testid="docket-clerk-report-run-button"
                id="run-docket-clerk-report"
                onClick={() => runDocketClerkReportSequence()}
              >
                Run Report
              </Button>
            </div>
          </div>

          {docketClerkReportHelper.showResults && (
            <div className="margin-top-5">
              <div className="title">
                <h2 data-testid="docket-clerk-report-title">
                  {docketClerkReportHelper.reportTitle}
                </h2>
              </div>
              {docketClerkReportHelper.showDocumentQc && (
                <DocketClerkReportDocumentQc />
              )}
              {docketClerkReportHelper.showMessages && (
                <DocketClerkReportMessages />
              )}
            </div>
          )}
        </section>
      </>
    );
  },
);

DocketClerkReport.displayName = 'DocketClerkReport';
