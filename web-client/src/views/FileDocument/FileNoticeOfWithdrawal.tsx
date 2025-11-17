import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import { Focus } from '@web-client/ustc-ui/Focus/Focus';
import React from 'react';

export const FileNoticeOfWithdrawal = connect(
  {
    fileNoticeOfWithdrawalHelper: state.fileNoticeOfWithdrawalHelper,
    form: state.form,
  },
  function FileNoticeOfWithdrawal({
    // fileNoticeOfWithdrawalHelper,
    form,
  }) {
    return (
      <div className="grid-container">
        <Focus>
          <h1
            className="margin-bottom-105"
            id="file-a-document-header"
            tabIndex={-1}
          >
            File Your Document(s)
          </h1>
        </Focus>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>

        <h2 className="margin-top-4">{form.documentTitle}</h2>
        <FormGroup>
          {/* need to implement validation on form group*/}
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="with-hint" id="who-legend">
              Who are you filing the document(s) on behalf of?
            </legend>
            <span className="usa-hint">Check all that apply.</span>

            {/* {formattedCaseDetail.petitioners.map(petitioner => (
              <div className="usa-checkbox" key={petitioner.contactId}>
                <input
                  checked={form.filersMap[petitioner.contactId] || false}
                  disabled={petitioner.isCurrentUser}
                  className="usa-checkbox__input"
                  id={`filing-${petitioner.contactId}`}
                  name={`filersMap.${petitioner.contactId}`}
                  type="checkbox"
                  onChange={e => {}}
                />
                <label
                  className="usa-checkbox__label"
                  data-testid={`filingParty-${petitioner.displayName}`}
                  htmlFor={`filing-${petitioner.contactId}`}
                >
                  {petitioner.displayName}
                </label>
              </div>
            ))} */}
            {/* <div className="usa-checkbox">
              <input
                aria-describedby="who-legend"
                checked={form.partyIrsPractitioner || false}
                className="usa-checkbox__input"
                id="party-irs-practitioner"
                name="partyIrsPractitioner"
                type="checkbox"
                onChange={e => {}}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="party-irs-practitioner"
                data-testid="party-irs-practitioner-label"
              >
                Respondent
              </label>
            </div> */}
          </fieldset>
        </FormGroup>
      </div>
    );
  },
);

FileNoticeOfWithdrawal.displayName = 'FileNoticeOfWithdrawal';
