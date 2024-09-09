import { InlineLink } from '@web-client/ustc-ui/InlineLink/InlineLink';
import { ProcedureType } from '@web-client/views/StartCase/ProcedureType';
import { TrialCity } from '@web-client/views/StartCase/TrialCity';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep4 = connect(
  {
    deleteValidationErrorMessageSequence:
      sequences.deleteValidationErrorMessageSequence,
    form: state.form,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function UpdatedFilePetitionStep4({
    deleteValidationErrorMessageSequence,
    form,
    petitionGenerationLiveValidationSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <div className="margin-bottom-5">
          <p className="margin-top-0 required-statement">
            *All fields required
          </p>
          <h2>Case procedure</h2>
          <div className="maxw-none tax-case-info">
            If your case qualifies, you may choose to have it handled as a small
            tax case. The Court handles small tax cases differently.{' '}
            <InlineLink href="https://ustaxcourt.gov/case_procedure.html">
              Which case procedure should I choose?
            </InlineLink>
          </div>

          <div className="margin-top-3">
            <ProcedureType
              legend="Select case procedure"
              value={form.procedureType}
              onChange={e => {
                updateFormValueSequence({
                  key: 'procedureType',
                  value: e.target.value,
                });

                deleteValidationErrorMessageSequence({
                  validationKey: ['procedureType'],
                });

                form.preferredTrialCity = '';
              }}
            />
          </div>
          {form.procedureType && (
            <div>
              <h2>U.S. Tax Court trial locations</h2>
              <div className="max-width-900 tax-case-info">
                This is your preferred location where your case may be heard if
                it goes to trial. Trial locations may vary based on case
                procedure selected.
                <span>
                  {' '}
                  <InlineLink href="https://www.ustaxcourt.gov/dpt_cities.html">
                    Trial locations
                  </InlineLink>
                </span>
              </div>
              <TrialCity
                label="Preferred trial location"
                procedureType={form.procedureType}
                showDefaultOption={true}
                value={form.preferredTrialCity || ''}
                onBlur={() => {
                  petitionGenerationLiveValidationSequence({
                    validationKey: ['preferredTrialCity'],
                  });
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });

                  deleteValidationErrorMessageSequence({
                    validationKey: ['preferredTrialCity'],
                  });
                }}
              />
            </div>
          )}
        </div>
        <div>
          <UpdatedFilePetitionButtons />
        </div>
      </>
    );
  },
);
