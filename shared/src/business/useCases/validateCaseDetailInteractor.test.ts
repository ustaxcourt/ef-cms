import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import { CaseQC } from '../entities/cases/CaseQC';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { validateCaseDetailInteractor } from './validateCaseDetailInteractor';
const { VALIDATION_ERROR_MESSAGES } = CaseQC;

describe('validate case detail', () => {
  const petitioners = [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactType: CONTACT_TYPES.primary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Test Petitioner',
      phone: '1234567890',
      postalCode: '12345',
      state: 'TN',
    },
  ];

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {},
    });

    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
    });
  });

  it('does not return an error if that field is valid', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        caseCaption: 'A case caption',
      },
    });

    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
    });
  });

  it('returns no errors if the case validates', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.other,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            role: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
        ],
        docketNumber: '101-18',
        filingType: 'Myself',
        hasVerifiedIrsNotice: true,
        irsNoticeDate: applicationContext.getUtilities().createISODateString(),
        partyType: PARTY_TYPES.petitioner,
        petitioners,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
    });

    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors: any = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        hasVerifiedIrsNotice: true,
        irsNoticeDate: 'aa',
      },
    });

    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
  });

  it('returns no errors on valid amounts and years', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.other,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
        ],
        docketNumber: '101-18',
        filingType: CASE_TYPES_MAP.other,
        hasVerifiedIrsNotice: true,
        irsNoticeDate: applicationContext.getUtilities().createISODateString(),
        partyType: PARTY_TYPES.petitioner,
        petitioners,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
    });

    expect(errors).toEqual(null);
  });

  it('returns no errors on null irsNoticeDate', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.other,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
        ],
        docketNumber: '101-18',
        filingType: CASE_TYPES_MAP.other,
        hasVerifiedIrsNotice: false,
        irsNoticeDate: null,
        partyType: PARTY_TYPES.petitioner,
        petitioners,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
    });

    expect(errors).toEqual(null);
  });

  it('should validate a new Case entity when useCaseEntity is true', () => {
    const errors = validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.other,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            docketNumber: '101-18',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            filedByRole: ROLES.petitioner,
            userId: '9271f5ca-e7c9-40e8-b465-e970e22934e8',
          },
        ],
        docketNumber: '101-18',
        filingType: CASE_TYPES_MAP.other,
        irsNoticeDate: applicationContext.getUtilities().createISODateString(),
        partyType: PARTY_TYPES.petitioner,
        petitioners,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        signature: true,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
      useCaseEntity: true,
    });

    expect(errors).toEqual(null);
  });
});
