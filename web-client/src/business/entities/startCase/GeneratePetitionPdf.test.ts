import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import {
  GeneratePetitionPdf,
  RawGeneratePetitionPdf,
} from '@web-client/business/entities/startCase/GeneratePetitionPdf';

describe('GeneratePetitionPdf', () => {
  const VALID_ENTITY = {
    caseCaptionExtension: 'TEST_caseCaptionExtension',
    caseTitle: 'TEST_caseTitle',
    contactPrimary: {
      address1: 'test_address1',
      city: 'test_city',
      contactType: 'primary',
      country: 'test_country',
      countryType: 'test_countryType',
      email: 'test_email',
      name: 'test_name',
      phone: 'test_phone',
      postalCode: 'test_postalCode',
      state: 'test_state',
    },
    hasIrsNotice: true,
    hasUploadedIrsNotice: true,
    originalCaseType: 'Deficiency',
    petitionFacts: ['TEST_petitionFacts'],
    petitionReasons: ['TEST_petitionReasons'],
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'TEST_preferredTrialCity',
    procedureType: 'Regular',
    irsNotices: [],
  };

  it('should create a valid instance of "GeneratePetitionPdf" entity', () => {
    const entity = new GeneratePetitionPdf(
      VALID_ENTITY as RawGeneratePetitionPdf,
    );

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  it('should throw validation errors when data is not valid', () => {
    const entity = new GeneratePetitionPdf(
      {} as unknown as RawGeneratePetitionPdf,
    );
    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual({
      caseCaptionExtension: '"caseCaptionExtension" is required',
      caseTitle: '"caseTitle" is required',
      contactPrimary: '"contactPrimary" is required',
      hasIrsNotice: '"hasIrsNotice" is required',
      hasUploadedIrsNotice: '"hasUploadedIrsNotice" is required',
      originalCaseType: '"originalCaseType" is required',
      petitionFacts: '"petitionFacts" is required',
      petitionReasons: '"petitionReasons" is required',
      preferredTrialCity: '"preferredTrialCity" is required',
      procedureType: '"procedureType" is required',
    });
  });
});
