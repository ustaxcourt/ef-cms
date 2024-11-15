import { CalendaredCase } from './CalendaredCase';
import { MOCK_CASE_WITH_SECONDARY_OTHERS } from '../../../test/mockCase';
import { MOCK_COMPLEX_CASE } from '../../../test/mockComplexCase';

describe('CalendaredCase', () => {
  it('allowlists the fields set within the entity, removing those not defined', () => {
    const calendaredCase = new CalendaredCase(
      MOCK_CASE_WITH_SECONDARY_OTHERS,
    ) as any;

    expect(calendaredCase.getFormattedValidationErrors()).toBe(null);
    expect(calendaredCase.docketEntries).toBeUndefined();
    expect(calendaredCase.consolidatedCases).toBeUndefined();
    expect(calendaredCase.automaticBlocked).toBeUndefined();
    expect(calendaredCase.caseStatusHistory).toBeUndefined();
    expect(calendaredCase.qcCompleteForTrial).toBeUndefined();
    expect(calendaredCase.noticeOfAttachments).toBeUndefined();
    expect(calendaredCase.orderDesignatingPlaceOfTrial).toBeUndefined();
    expect(calendaredCase.orderForAmendedPetition).toBeUndefined();
    expect(calendaredCase.orderForAmendedPetitionAndFilingFee).toBeUndefined();
    expect(calendaredCase.orderForFilingFee).toBeUndefined();
    expect(calendaredCase.orderForCds).toBeUndefined();
    expect(calendaredCase.archivedDocketEntries).toBeUndefined();
    expect(calendaredCase.statistics).toBeUndefined();
    expect(calendaredCase.correspondence).toBeUndefined();
    expect(calendaredCase.archivedCorrespondences).toBeUndefined();
    expect(calendaredCase.hearings).toBeUndefined();
    expect(calendaredCase.createdAt).toBeUndefined();
    expect(calendaredCase.filingType).toBeUndefined();
    expect(calendaredCase.hasVerifiedIrsNotice).toBeUndefined();
    expect(calendaredCase.irsNoticeDate).toBeUndefined();
    expect(calendaredCase.isPaper).toBeUndefined();
    expect(calendaredCase.partyType).toBeUndefined();
    expect(calendaredCase.petitionPaymentDate).toBeUndefined();
    expect(calendaredCase.petitionPaymentMethod).toBeUndefined();
    expect(calendaredCase.petitionPaymentStatus).toBeUndefined();
    expect(calendaredCase.petitionPaymentWaivedDate).toBeUndefined();
    expect(calendaredCase.preferredTrialCity).toBeUndefined();
    expect(calendaredCase.receivedAt).toBeUndefined();
    expect(calendaredCase.trialDate).toBeUndefined();
    expect(calendaredCase.trialLocation).toBeUndefined();
    expect(calendaredCase.trialSessionId).toBeUndefined();
    expect(calendaredCase.trialTime).toBeUndefined();
    expect(calendaredCase.initialDocketNumberSuffix).toBeUndefined();
    expect(calendaredCase.initialCaption).toBeUndefined();
    expect(calendaredCase.hasPendingItems).toBeUndefined();
    expect(calendaredCase.initialDocketNumberSuffix).toBeUndefined();

    expect(calendaredCase.irsPractitioners!.length).toEqual(0);
  });

  it('retains irsPractitioners and privatePractitioners', () => {
    const calendaredCase = new CalendaredCase(MOCK_COMPLEX_CASE);

    expect(calendaredCase.irsPractitioners!.length).toBeTruthy();
    expect(calendaredCase.privatePractitioners!.length).toEqual(0);
  });

  it('creates the docketNumberWithSuffix field correctly', () => {
    const calendaredCase = new CalendaredCase({
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      docketNumberSuffix: 'S',
    });

    expect(calendaredCase.getFormattedValidationErrors()).toBe(null);
    expect(calendaredCase.docketNumberWithSuffix).toBe('109-19S');
  });

  it('sets PMTServedPartiesCode when a case includes an unstricken PMT type document', () => {
    const calendaredCase = new CalendaredCase(MOCK_COMPLEX_CASE);

    expect(calendaredCase.getFormattedValidationErrors()).toBe(null);
    expect(calendaredCase.PMTServedPartiesCode).toBe('P');
  });
});
