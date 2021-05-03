import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  { formattedCaseDetail: state.formattedCaseDetail },
  function PartiesInformation({ formattedCaseDetail }) {
    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-3">
            <div className="border border-base-lighter">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div className="">
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Petitioner(s) & Counsel
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Intervenor/Participants & Counsel
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                  )}
                >
                  <div className="grid-row margin-left-205">
                    Respondent Counsel
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid-col-9">
            <div className="grid-row">
              <div className="grid-col-4">
                <h3>Petitioner(s)</h3>
              </div>
              <div className="grid-col-2">
                <div className="text-right">
                  <span
                    className="label margin-right-4 margin-top-05"
                    id="practitioner-counsel-search-description"
                  >
                    Add counsel
                  </span>
                </div>
              </div>
              <div className="grid-col-4">
                <FormGroup
                  className="margin-bottom-0 margin-top-0"
                  // errorText={validationErrors.practitionerSearchError}
                >
                  <form
                    className="usa-search"
                    onSubmit={e => {
                      e.preventDefault();
                      // openAddPrivatePractitionerModalSequence();
                    }}
                  >
                    <div role="search">
                      <label
                        className="usa-sr-only"
                        htmlFor="practitioner-search-field"
                      >
                        Search
                      </label>
                      <input
                        aria-describedby="practitioner-counsel-search-description"
                        className={classNames(
                          'usa-input margin-bottom-0',
                          // validationErrors.practitionerSearchError &&
                          //   'usa-input--error',
                        )}
                        id="practitioner-search-field"
                        name="practitionerSearch"
                        placeholder="Enter bar no. or name"
                        type="search"
                        // value={form.practitionerSearch || ''}
                      />
                      <button
                        className="small-search-button usa-button"
                        id="search-for-practitioner"
                        type="submit"
                      >
                        <span className="usa-search__submit-text">Search</span>
                      </button>
                    </div>
                  </form>
                </FormGroup>
              </div>
              <div className="grid-col-2">
                <Button link className="float-right" icon="plus-circle">
                  Add Party
                </Button>
              </div>
            </div>

            <div className="grid-row grid-gap">
              {formattedCaseDetail.petitioners.map(petitioner => (
                <div
                  className="grid-col-4 margin-bottom-4"
                  key={petitioner.contactId}
                >
                  <div className="card height-full">
                    <div className="content-wrapper parties-card">
                      <h3>
                        {petitioner.name}
                        <Button
                          link
                          className="margin-top-1 padding-0 float-right"
                          href={'/case-detail/'}
                          icon="edit"
                        >
                          Edit
                        </Button>
                      </h3>
                      <div className="bg-primary text-white padding-1">
                        Petitioner
                      </div>
                      <AddressDisplay
                        contact={{
                          ...petitioner,
                          name: undefined,
                        }}
                        showEmail={true}
                        // showSealAddressLink={caseInformationHelper.showSealAddressLink}
                      />
                      {petitioner.serviceIndicator && (
                        <div className="margin-top-4">
                          <p className="semi-bold margin-bottom-0">
                            Service preference
                          </p>
                          {petitioner.serviceIndicator}
                        </div>
                      )}
                      <h4 className="margin-top-3">Counsel</h4>
                      {formattedCaseDetail.privatePractitioners.map(
                        privatePractitioner => (
                          <p key={privatePractitioner.userId}>
                            <span className="address-line">
                              {privatePractitioner.name}{' '}
                              {`(${privatePractitioner.barNumber})`}{' '}
                              <Button
                                link
                                className="margin-top-1 padding-0 margin-left-1"
                                href={'/case-detail/'}
                                icon="edit"
                              >
                                Edit
                              </Button>
                            </span>
                            <span className="address-line">
                              {privatePractitioner.email}
                            </span>
                            <span className="address-line">
                              {privatePractitioner.contact.phone}
                            </span>
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export { PartiesInformation };
