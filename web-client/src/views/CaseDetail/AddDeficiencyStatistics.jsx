import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDeficiencyStatistics = connect(
  {
    calculatePenaltiesForAddSequence:
      sequences.calculatePenaltiesForAddSequence,
    form: state.form,
    showCalculatePenaltiesModalSequence:
      sequences.showCalculatePenaltiesModalSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function StatisticsForm({
    calculatePenaltiesForAddSequence,
    form,
    showCalculatePenaltiesModalSequence,
    showModal,
    updateFormValueSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Deficiency Statistics</h1>

          <div className="blue-container margin-bottom-5">
            <div className="margin-bottom-0">
              <label className="usa-label" htmlFor="name">
                Select Year or period
              </label>

              <FormGroup>
                <fieldset className="usa-fieldset">
                  {['Year', 'Period'].map(option => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        checked={form.yearOrPeriod === option}
                        className="usa-radio__input"
                        id={'year-or-period'}
                        name={'yearOrPeriod'}
                        type="radio"
                        value={option}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'year-or-period'}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </FormGroup>

              <div className="grid-row grid-gap-4">
                <div className="grid-col-3">
                  <FormGroup>
                    <label className="usa-label" htmlFor={'year'}>
                      Year
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      id={'year'}
                      maxLength="4"
                      name={'year'}
                      placeholder="YYYY"
                      value={form.year || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="grid-row grid-gap-2">
                <div className="grid-col-3">
                  <FormGroup>
                    <label className="usa-label" htmlFor={'deficiency-amount'}>
                      Deficiency (IRS Notice)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline"
                      id={'deficiency-amount'}
                      name={'deficiencyAmount'}
                      value={form.deficiencyAmount || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
                      onValueChange={values => {
                        updateFormValueSequence({
                          key: 'deficiencyAmount',
                          value: values.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>

                <div className="grid-col-3">
                  <FormGroup>
                    <label className="usa-label" htmlFor={'total-penalties'}>
                      Total penalties (IRS Notice)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline"
                      id={'deficiency-amount'}
                      name={'totalPenalties'}
                      value={form.totalPenalties || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
                      onValueChange={values => {
                        updateFormValueSequence({
                          key: 'totalPenalties',
                          value: values.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>

                <div className="grid-col-3">
                  <Button
                    link
                    className="padding-0 calculate-penalties"
                    icon="calculator"
                    onClick={() =>
                      showCalculatePenaltiesModalSequence({
                        key: 'totalPenalties',
                      })
                    }
                  >
                    Calculate Penalties as determined by Court
                  </Button>
                </div>
              </div>

              <div className="grid-row grid-gap-2">
                <div className="grid-col-3">
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'deficiency-amount-determination'}
                    >
                      Deficiency (Determination)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline"
                      id={'deficiency-amount-determination'}
                      name={'deficiencyAmountDetermination'}
                      value={form.deficiencyAmountDetermination || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
                      onValueChange={values => {
                        updateFormValueSequence({
                          key: 'deficiencyAmountDetermination',
                          value: values.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>

                <div className="grid-col-3">
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'total-penalties-determination'}
                    >
                      Total penalties (Determination)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline"
                      id={'deficiency-amount-determination'}
                      name={'totalPenaltiesDetermination'}
                      value={form.totalPenaltiesDetermination || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
                      onValueChange={values => {
                        updateFormValueSequence({
                          key: 'totalPenaltiesDetermination',
                          value: values.value,
                        });
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="grid-col-3">
                  <Button
                    link
                    className="padding-0 calculate-penalties"
                    icon="calculator"
                    onClick={() =>
                      showCalculatePenaltiesModalSequence({
                        key: 'totalPenaltiesDetermination',
                      })
                    }
                  >
                    Calculate Penalties on IRS Notice
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="margin-top-3">
            <Button onClick={() => {}}>Save</Button>

            <Button link onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </section>
        {showModal === 'CalculatePenaltiesModal' && (
          <CalculatePenaltiesModal
            confirmSequence={() => calculatePenaltiesForAddSequence()}
          />
        )}
      </>
    );
  },
);
