import { CalendaredCase } from './CalendaredCase';
import { MOCK_CASE_WITH_SECONDARY_OTHERS } from '../../../test/mockCase';
import { MOCK_COMPLEX_CASE } from '../../../test/mockComplexCase';

describe('CalendaredCase', () => {
  it('allowlists the fields set within the entity, removing those not defined', () => {
    const calendaredCase = new CalendaredCase(MOCK_CASE_WITH_SECONDARY_OTHERS);

    expect(calendaredCase.getFormattedValidationErrors()).toBe(null);
    expect((calendaredCase as any).docketEntries).toBeUndefined();
    expect((calendaredCase as any).consolidatedCases).toBeUndefined();
    expect((calendaredCase as any).petitioners).toBeUndefined();
    expect((calendaredCase as any).associatedJudge).toBeUndefined();
    expect((calendaredCase as any).automaticBlocked).toBeUndefined();
    expect((calendaredCase as any).caseStatusHistory).toBeUndefined();
    expect((calendaredCase as any).qcCompleteForTrial).toBeUndefined();
    expect((calendaredCase as any).noticeOfAttachments).toBeUndefined();
    expect(
      (calendaredCase as any).orderDesignatingPlaceOfTrial,
    ).toBeUndefined();
    expect((calendaredCase as any).orderForAmendedPetition).toBeUndefined();
    expect(
      (calendaredCase as any).orderForAmendedPetitionAndFilingFee,
    ).toBeUndefined();
    expect((calendaredCase as any).orderForFilingFee).toBeUndefined();
    expect((calendaredCase as any).orderForCds).toBeUndefined();
    expect((calendaredCase as any).archivedDocketEntries).toBeUndefined();
    expect((calendaredCase as any).statistics).toBeUndefined();
    expect((calendaredCase as any).correspondence).toBeUndefined();
    expect((calendaredCase as any).archivedCorrespondences).toBeUndefined();
    expect((calendaredCase as any).isSealed).toBeUndefined();
    expect((calendaredCase as any).hearings).toBeUndefined();
    expect((calendaredCase as any).createdAt).toBeUndefined();
    expect((calendaredCase as any).filingType).toBeUndefined();
    expect((calendaredCase as any).hasVerifiedIrsNotice).toBeUndefined();
    expect((calendaredCase as any).irsNoticeDate).toBeUndefined();
    expect((calendaredCase as any).isPaper).toBeUndefined();
    expect((calendaredCase as any).partyType).toBeUndefined();
    expect((calendaredCase as any).petitionPaymentDate).toBeUndefined();
    expect((calendaredCase as any).petitionPaymentMethod).toBeUndefined();
    expect((calendaredCase as any).petitionPaymentStatus).toBeUndefined();
    expect((calendaredCase as any).petitionPaymentWaivedDate).toBeUndefined();
    expect((calendaredCase as any).preferredTrialCity).toBeUndefined();
    expect((calendaredCase as any).receivedAt).toBeUndefined();
    expect((calendaredCase as any).trialDate).toBeUndefined();
    expect((calendaredCase as any).trialLocation).toBeUndefined();
    expect((calendaredCase as any).trialSessionId).toBeUndefined();
    expect((calendaredCase as any).trialTime).toBeUndefined();
    expect((calendaredCase as any).initialDocketNumberSuffix).toBeUndefined();
    expect((calendaredCase as any).initialCaption).toBeUndefined();
    expect((calendaredCase as any).hasPendingItems).toBeUndefined();
    expect((calendaredCase as any).initialDocketNumberSuffix).toBeUndefined();

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
