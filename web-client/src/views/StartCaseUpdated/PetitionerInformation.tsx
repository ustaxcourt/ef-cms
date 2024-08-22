import {
  ALL_STATE_OPTIONS,
  BUSINESS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CardHeader } from './CardHeader';
import React from 'react';

export function PetitionerInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={1} title="Petitioner Information" />
        <div className="petition-review-petitioner-section">
          <div>
            <span className="usa-label usa-label-display">Party type</span>
            <div data-testid="party-type">{petitionFormatted.partyType}</div>
            {petitionFormatted.corporateDisclosureFile && (
              <div className="margin-top-3">
                <span
                  className="usa-label usa-label-display"
                  data-testid="corporate-disclosure-file-title"
                >
                  Corporate Disclosure Statement
                </span>
                <div>
                  <div>
                    <div className="grid-col flex-auto">
                      <Button
                        link
                        className="padding-0 text-left word-break"
                        data-testid="cds-preview-button"
                        href={petitionFormatted.corporateDisclosureFileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {petitionFormatted.corporateDisclosureFile.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="petition-review-spacing">
            <div>
              <span
                className="usa-label usa-label-display"
                id="filing-contact-primary"
              >
                Petitioner contact information
              </span>
              {petitionFormatted.contactPrimary && (
                <address aria-labelledby="filing-contact-primary">
                  <AddressDisplay
                    noMargin
                    contact={petitionFormatted.contactPrimary}
                  />
                  {petitionFormatted.contactPrimary.placeOfLegalResidence && (
                    <div className="margin-top-1">
                      <span
                        className="text-semibold"
                        data-testid="place-of-legal-residence-label"
                      >
                        {Object.values(BUSINESS_TYPES).includes(
                          petitionFormatted.partyType,
                        )
                          ? 'Place of business:'
                          : 'Place of legal residence:'}
                      </span>
                      <span
                        className="margin-left-05"
                        data-testid="primary-place-of-legal-residence"
                      >
                        {
                          ALL_STATE_OPTIONS[
                            petitionFormatted.contactPrimary
                              .placeOfLegalResidence
                          ]
                        }
                      </span>
                    </div>
                  )}

                  <div className="margin-top-3">
                    <span className="usa-label usa-label-display">
                      Service email
                    </span>
                    <span data-testid="contact-primary-email">
                      {petitionFormatted.contactPrimary.email}
                    </span>
                  </div>
                </address>
              )}
            </div>
          </div>
          {petitionFormatted.contactSecondary && (
            <div className="petition-review-spacing">
              <div>
                <span
                  className="usa-label usa-label-display"
                  id="filing-contact-secondary"
                >
                  {"Spouse's contact information"}
                </span>
                <address aria-labelledby="filing-contact-secondary">
                  <AddressDisplay
                    noMargin
                    showEmail
                    contact={{
                      ...petitionFormatted.contactSecondary,
                      email:
                        petitionFormatted.contactSecondary.paperPetitionEmail,
                    }}
                  />
                </address>
                <div className="margin-top-1">
                  <span className="text-semibold">
                    Register for eService/filing:
                  </span>
                  <span className="margin-left-05">
                    {petitionFormatted.contactSecondary.hasConsentedToEService
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>
                {petitionFormatted.contactSecondary.placeOfLegalResidence && (
                  <div className="margin-top-1">
                    <span className="text-semibold">
                      Place of legal residence:
                    </span>
                    <span
                      className="margin-left-05"
                      data-testid="secondary-place-of-legal-residence"
                    >
                      {
                        ALL_STATE_OPTIONS[
                          petitionFormatted.contactSecondary
                            .placeOfLegalResidence
                        ]
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
