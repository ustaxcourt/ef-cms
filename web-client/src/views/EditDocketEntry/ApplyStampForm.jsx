import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ApplyStampForm = connect(
  { form: state.form, validationErrors: state.validationErrors },
  function ApplyStampForm({ form, validationErrors }) {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Apply Stamp
            </h1>
          </div>

          <div className="grid-row grid-gap">
            <Button
              link
              className="margin-bottom-3"
              href="/trial-sessions"
              icon={['fa', 'arrow-alt-circle-left']}
            >
              Back to Document View
            </Button>
          </div>

          <div className="blue-container docket-entry-form">
            <FormGroup errorText={validationErrors.status}>
              <fieldset className="usa-fieldset">
                <legend className="usa-legend">Stamp Order</legend>
                {['Granted', 'Denied'].map(option => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      checked={form.lodged === (option === 'Granted')}
                      className="usa-radio__input"
                      id={`motion-status-${option}`}
                      name="status"
                      type="radio"
                      value={option}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`motion-status-${option}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
            </FormGroup>

            <hr />

            <FormGroup>
              <label className="usa-label" htmlFor="stricken-case-radio">
                Select any that apply{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={true}
                  className="usa-radio__input"
                  id="stricken-case-radio"
                  name="stricken-case"
                  type="radio"
                />
                <label className="usa-radio__label" htmlFor={'stricken-case'}>
                  This case is stricken from the trial session
                </label>
              </div>
            </FormGroup>
            <hr />
            <FormGroup>
              {/* is it bad to remove label from this formgroup? */}
              {/* <label className="usa-label" htmlFor="jurisdiction">
                Select any that apply{' '}
                <span className="usa-hint">(optional)</span>
              </label> */}
              <div className="usa-radio">
                <input
                  checked={true}
                  className="usa-radio__input"
                  name="general-docket"
                  type="radio"
                />
                <label className="usa-radio__label" htmlFor={'general-docket'}>
                  The case is restored to the general docket
                </label>
              </div>
              <div className="usa-radio">
                <input
                  checked={true}
                  className="usa-radio__input"
                  name="undersigned"
                  type="radio"
                />
                <label className="usa-radio__label" htmlFor={'undersigned'}>
                  Jurisdiction is retained by the undersigned
                </label>
              </div>
            </FormGroup>
            <hr />
            <FormGroup>
              <div className="usa-radio">
                <input
                  checked={true}
                  className="usa-radio__input"
                  name="status-report"
                  type="radio"
                />
                <label className="usa-radio__label" htmlFor={'status-report'}>
                  The parties shall file a status report by{' '}
                  <DateInput
                    className="display-inline-block width-card"
                    id="status-report-or-stip-decision-due-date"
                    names={{
                      day: 'lastDateOfPeriodDay',
                      month: 'lastDateOfPeriodMonth',
                      year: 'lastDateOfPeriodYear',
                    }}
                    placeholder={'MM/DD/YYYY'}
                    showDateHint={false}
                    values={{
                      day: form.lastDateOfPeriodDay,
                      month: form.lastDateOfPeriodMonth,
                      year: form.lastDateOfPeriodYear,
                    }}
                  />
                </label>
              </div>
              <div className="usa-radio">
                <input
                  checked={true}
                  className="usa-radio__input"
                  name="status-report-or-stip-decision"
                  type="radio"
                />
                <label
                  className="usa-radio__label"
                  htmlFor={'status-report-or-stip-decision'}
                >
                  The parties shall file a status report or proposed stipulated
                  decision by{' '}
                  <DateInput
                    className="display-inline-block width-card"
                    id="status-report-or-stip-decision-due-date"
                    names={{
                      day: 'lastDateOfPeriodDay',
                      month: 'lastDateOfPeriodMonth',
                      year: 'lastDateOfPeriodYear',
                    }}
                    placeholder={'MM/DD/YYYY'}
                    showDateHint={false}
                    values={{
                      day: form.lastDateOfPeriodDay,
                      month: form.lastDateOfPeriodMonth,
                      year: form.lastDateOfPeriodYear,
                    }}
                  />
                </label>
              </div>
            </FormGroup>
            <hr />
            <FormGroup errorText={validationErrors.customOrderText}>
              <div>
                <label
                  className="usa-label"
                  htmlFor="custom-order-text"
                  id="custom-order-text-label"
                >
                  Custom order text <span className="usa-hint">(optional)</span>
                </label>
                <textarea
                  aria-describedby="custom-order-text-label"
                  autoCapitalize="none"
                  className="usa-textarea height-8 usa-character-count__field"
                  id="custom-order-text"
                  maxLength="60"
                  name="custom-order-text"
                  type="text"
                  value={form.customOrderText || ''}
                ></textarea>
                <span
                  aria-live="polite"
                  className="usa-hint usa-character-count__message"
                  id="with-hint-textarea-info"
                >
                  You can enter up to 60 characters
                </span>
              </div>
            </FormGroup>
          </div>
        </section>
      </>
    );
  },
);
