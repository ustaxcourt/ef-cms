import { ALLOWLIST_FEATURE_FLAGS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  ordersAndNoticesInDraftsCodes,
  ordersAndNoticesNeededCodes,
  reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed,
} from './reviewSavedPetitionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const { INITIAL_DOCUMENT_TYPES, PAYMENT_STATUS } =
  applicationContext.getConstants();

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
  applicationContext,
);

describe('reviewSavedPetitionHelper', () => {
  it('should return the default form values if there are no changes to the form', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
        },
      },
    });
    expect(result).toMatchObject({
      corporateDisclosureFile: undefined,
      hasIrsNoticeFormatted: 'No',
      irsNoticeDateFormatted: undefined,
      ordersAndNoticesNeeded: [],
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: 'No requested place of trial',
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  it('return an empty array for ordersAndNoticesNeeded if any orders or notices were not captured but other form data were', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          docketEntries: [
            { documentType: INITIAL_DOCUMENT_TYPES.petition.documentType },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
            },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
            },
            { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee
                  .documentType,
            },
          ],
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-01-05T03:30:45.007Z',
          petitionPaymentDate: '2020-03-14T14:02:04.007Z',
          petitionPaymentMethod: 'pay.gov',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
      },
    });

    expect(result).toMatchObject({
      applicationForWaiverOfFilingFeeFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
      },
      corporateDisclosureFile: {
        documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
      },
      hasIrsNoticeFormatted: 'Yes',
      irsNoticeDateFormatted: '01/04/20',
      ordersAndNoticesNeeded: [],
      petitionFile: {
        documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      },
      petitionPaymentStatusFormatted: 'Paid 03/14/20 pay.gov',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: '01/04/20',
      requestForPlaceOfTrialFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      },
      shouldShowIrsNoticeDate: true,
      stinFile: { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
    });
  });

  it('returns an undefined requestForPlaceOfTrialFile if the RQT docket entry is a minute entry', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          docketEntries: [
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
              eventCode:
                INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
            },
          ],
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-01-05T03:30:45.007Z',
          orderForAmendedPetitionAndFilingFee: true,
          petitionPaymentDate: '2020-03-14T14:02:04.007Z',
          petitionPaymentMethod: 'pay.gov',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
      },
    });

    expect(result.requestForPlaceOfTrialFile).toBeUndefined();
  });

  it('returns a petitionPaymentStatusFormatted for a waived payment status', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
        },
      },
    });

    expect(result).toMatchObject({
      petitionPaymentStatusFormatted: 'Waived 03/01/19',
    });
  });

  it('returns a message when preferred trial city has not been selected', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
        },
      },
    });

    expect(result).toMatchObject({
      corporateDisclosureFile: undefined,
      hasIrsNoticeFormatted: 'No',
      irsNoticeDateFormatted: undefined,
      ordersAndNoticesNeeded: [],
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: 'No requested place of trial',
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  it('returns a preferred trial city when it has been selected', () => {
    const mockCity = 'Nowhere, USA';
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          preferredTrialCity: mockCity,
        },
      },
    });

    expect(result).toMatchObject({
      corporateDisclosureFile: undefined,
      hasIrsNoticeFormatted: 'No',
      irsNoticeDateFormatted: undefined,
      ordersAndNoticesNeeded: [],
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: mockCity,
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  Object.keys(ordersAndNoticesNeededCodes).forEach(orderOrNotice => {
    it(`should verify ordersAndNoticesNeeded is populated with ${orderOrNotice}`, () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          form: {
            contactPrimary: { hasConsentedToEService: true },
            contactSecondary: { hasConsentedToEService: true },
            [orderOrNotice]: true,
          },
        },
      });

      expect(result).toMatchObject({
        ordersAndNoticesNeeded: [ordersAndNoticesNeededCodes[orderOrNotice]],
      });
    });
  });

  Object.keys(ordersAndNoticesInDraftsCodes).forEach(orderOrNoticeInDraft => {
    it(`should verify ordersAndNoticesInDraft is populated with ${orderOrNoticeInDraft}`, () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          form: {
            contactPrimary: { hasConsentedToEService: true },
            contactSecondary: { hasConsentedToEService: true },
            [orderOrNoticeInDraft]: true,
          },
        },
      });

      expect(result).toMatchObject({
        ordersAndNoticesInDraft: [
          ordersAndNoticesInDraftsCodes[orderOrNoticeInDraft],
        ],
      });
    });
  });

  it('returns showStatistics false if the statistics array is not present on the form', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
        },
      },
    });

    expect(result.showStatistics).toBeFalsy();
  });

  it('returns showStatistics false if the statistics array is present on the form but has length 0', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          statistics: [],
        },
      },
    });

    expect(result.showStatistics).toBeFalsy();
  });

  it('returns showStatistics true if the statistics array is present on the form and has length greater than 0', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          statistics: [{ yearOrPeriod: 'Year' }],
        },
      },
    });

    expect(result.showStatistics).toBeTruthy();
  });

  it('formats statistics with formatted dates and money', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              year: '2012',
              yearOrPeriod: 'Year',
            },
            {
              irsDeficiencyAmount: 0,
              irsTotalPenalties: 21,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              yearOrPeriod: 'Period',
            },
          ],
        },
      },
    });

    expect(result.formattedStatistics).toMatchObject([
      {
        formattedDate: '2012',
        formattedIrsDeficiencyAmount: '$123.00',
        formattedIrsTotalPenalties: '$30,000.00',
      },
      {
        formattedDate: '03/01/19',
        formattedIrsDeficiencyAmount: '$0.00',
        formattedIrsTotalPenalties: '$21.00',
      },
    ]);
  });

  it('adds the OAP to ordersAndNoticesInDraft when form.orderForAmendedPetition is true', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          orderForAmendedPetition: true,
        },
      },
    });

    expect(result.ordersAndNoticesInDraft).toEqual([
      'Order for Amended Petition',
    ]);
  });

  it('does not add the OAP to ordersAndNoticesInDraft when form.orderForAmendedPetition is false', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          contactPrimary: { hasConsentedToEService: true },
          contactSecondary: { hasConsentedToEService: true },
          orderForAmendedPetition: false,
        },
      },
    });

    expect(result.ordersAndNoticesInDraft).not.toBe([
      'Order for Amended Petition',
    ]);
  });

  it('should return attachmentToPetitionFile if the file was uploaded', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          docketEntries: [
            { documentType: INITIAL_DOCUMENT_TYPES.petition.documentType },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
              eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      attachmentToPetitionFile: {
        documentType: INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
      },
      petitionFile: {
        documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      },
    });
  });

  describe('E-service Consent label', () => {
    it('should return E-service consent text for primary and secondary contacts when hasConsentedToEService is true', () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            contactPrimary: {
              hasConsentedToEService: true,
              paperPetitionEmail: 'aCoolEmail@example.com',
            },
            contactSecondary: {
              hasConsentedToEService: true,
              paperPetitionEmail: 'anotherCoolEmail@example.com',
            },
          },
        },
      });

      expect(result.eServiceConsentTextForPrimaryContact).toBe(
        'E-service consent',
      );
      expect(result.eServiceConsentTextForSecondaryContact).toBe(
        'E-service consent',
      );
    });

    it('should return No e-service consent text for primary and secondary contacts when hasConsentedToEService is false', () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            contactPrimary: {
              hasConsentedToEService: false,
              paperPetitionEmail: 'aCoolEmail@example.com',
            },
            contactSecondary: {
              hasConsentedToEService: false,
              paperPetitionEmail: 'anotherCoolEmail@example.com',
            },
          },
        },
      });

      expect(result.eServiceConsentTextForPrimaryContact).toBe(
        'No e-service consent',
      );
      expect(result.eServiceConsentTextForSecondaryContact).toBe(
        'No e-service consent',
      );
    });

    it('should not return e-service text for the secondary petitioner when it does not exist', () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          form: {
            contactPrimary: {
              hasConsentedToEService: true,
              paperPetitionEmail: undefined,
            },
          },
        },
      });

      expect(result.eServiceConsentTextForSecondaryContact).toBeUndefined();
    });
  });

  it('should NOT display electronic service consent text when paper petition email has not been provided and the contact has NOT consented to electronic service', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
            true,
        },
        form: {
          contactPrimary: {
            hasConsentedToEService: false,
            paperPetitionEmail: undefined,
          },
          contactSecondary: {
            hasConsentedToEService: false,
            paperPetitionEmail: undefined,
          },
        },
      },
    });

    expect(result.shouldDisplayEConsentTextForPrimaryContact).toBe(false);
    expect(result.shouldDisplayEConsentTextForSecondaryContact).toBe(false);
  });

  it('should NOT display electronic service consent text when the feature flag is disabled', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
            false,
        },
        form: {
          contactPrimary: {
            hasConsentedToEService: false,
            paperPetitionEmail: undefined,
          },
          contactSecondary: {
            hasConsentedToEService: false,
            paperPetitionEmail: undefined,
          },
        },
      },
    });

    expect(result.shouldDisplayEConsentTextForPrimaryContact).toBeUndefined();
    expect(result.shouldDisplayEConsentTextForSecondaryContact).toBeUndefined();
  });
});
