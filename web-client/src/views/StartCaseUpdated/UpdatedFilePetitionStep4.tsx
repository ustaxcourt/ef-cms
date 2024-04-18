import { Button } from '@web-client/ustc-ui/Button/Button';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { ProcedureType } from '@web-client/views/StartCase/ProcedureType';
import { TrialCity } from '@web-client/views/StartCase/TrialCity';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep4 = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep4Sequence:
      sequences.updatedFilePetitionCompleteStep4Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep4({
    form,
    updatedFilePetitionCompleteStep4Sequence,
    updatedFilePetitionGoBackAStepSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="margin-bottom-5">
          <p className="margin-bottom-3 margin-top-0 required-statement">
            *All fields required
          </p>
          <h2>Case procedure</h2>
          <p className="maxw-none">
            If your case qualifies, you may choose to have it handled as a small
            tax case. The Court handles small tax cases differently.
          </p>
          <Button
            link
            className="usa-link--external text-left mobile-text-wrap"
            href="https://www.test.com/"
            overrideMargin="margin-right-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            Which case procedure should I choose?{' '}
            <Icon
              className="fa-icon-blue"
              icon={['fa-soli', 'fa-arrow-up-right-from-square']}
              size="1x"
            />
          </Button>

          <div className="margin-top-3">
            <ProcedureType
              legend="Select case procedure"
              value={form.procedureType}
              onChange={e => {
                updateFormValueSequence({
                  key: 'procedureType',
                  value: e.target.value,
                });
                validationErrors.procedureType = '';
                form.preferredTrialCity = '';
              }}
            />
          </div>
          {form.procedureType && (
            <div>
              <TrialCity
                label="Preferred trial location"
                procedureType={form.procedureType}
                showDefaultOption={true}
                showHint={true}
                showRegularTrialCitiesHint={
                  form.procedureType === PROCEDURE_TYPES_MAP.regular
                }
                showSmallTrialCitiesHint={
                  form.procedureType === PROCEDURE_TYPES_MAP.small
                }
                value={form.preferredTrialCity || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });
                  validationErrors.preferredTrialCity = '';
                }}
              />
            </div>
          )}
        </div>
        <div>
          <Button
            onClick={() => {
              updatedFilePetitionCompleteStep4Sequence();
            }}
          >
            Next
          </Button>
          <Button
            secondary
            onClick={() => {
              updatedFilePetitionGoBackAStepSequence();
            }}
          >
            Back
          </Button>
          <Button link onClick={() => console.log('Cancel')}>
            Cancel
          </Button>
        </div>
      </>
    );
  },
);
