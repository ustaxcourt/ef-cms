import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
  PARTY_TYPES,
  CONTACT_TYPES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { mockIrsPractitionerUser } from '@shared/test/mockAuthUsers';

describe('PublicCaseResponse', () => {
  const mockContactId = 'b430f7f9-06f3-4a25-915d-5f51adab2f29';
  const mock_rawPublicCase = {
    caseCaption: 'testing',
    createdAt: '2020-01-02T03:30:45.007Z',
    docketEntries: [{}],
    docketNumber: '101-20',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    filedByRole: ROLES.petitioner,
    irsPractitioners: [{ name: 'Bob' }],
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        contactId: mockContactId,
        contactType: CONTACT_TYPES.primary,
      },
    ],
    receivedAt: '2020-01-05T03:30:45.007Z',
    status: CASE_STATUS_TYPES.calendared,
  };
  const mock_publicCase = new PublicCase(mock_rawPublicCase, {
    authorizedUser: mockIrsPractitionerUser,
  });

  const getValidUnsealedRawPublicCase = () => ({
    ...mock_publicCase.toRawObject(),
    docketEntries: [],
    isSealed: false,
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        contactId: mockContactId,
        contactType: CONTACT_TYPES.primary,
      },
    ],
  });

  it('should create a PublicCaseResponse without options', () => {
    const publicCaseDTO = new PublicCaseResponse(mock_publicCase.toRawObject());
    expect(publicCaseDTO).toMatchObject({
      ...mock_publicCase.toRawObject(),
      entityName: 'PublicCaseResponse',
    });
  });
  it('should create a PublicCaseResponse with options', () => {
    const publicCaseDTO = new PublicCaseResponse(
      mock_publicCase.toRawObject(),
      {
        authorizedUser: mockIrsPractitionerUser,
      },
    );
    expect(publicCaseDTO).toMatchObject({
      ...mock_publicCase.toRawObject(),
      entityName: 'PublicCaseResponse',
    });
  });

  it('should require partyType and petitioners for unsealed cases', () => {
    const rawPublicCase = {
      ...getValidUnsealedRawPublicCase(),
      partyType: undefined,
      petitioners: undefined,
    };

    const publicCaseDTO = new PublicCaseResponse(rawPublicCase as any);

    expect(publicCaseDTO.isValid()).toBe(false);
    expect(publicCaseDTO.getValidationErrors()).toEqual(
      expect.objectContaining({
        partyType: expect.any(String),
        petitioners: expect.any(String),
      }),
    );
  });

  it('should reject public fields and docket entries for sealed cases', () => {
    const publicCaseDTO = new PublicCaseResponse({
      ...getValidUnsealedRawPublicCase(),
      caseCaption: 'Sealed Case Caption',
      docketEntries: mock_publicCase.toRawObject().docketEntries,
      isSealed: true,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          contactId: mockContactId,
          contactType: CONTACT_TYPES.primary,
        },
      ],
      receivedAt: '2020-01-05T03:30:45.007Z',
    });

    expect(publicCaseDTO.isValid()).toBe(false);
    expect(publicCaseDTO.getValidationErrors()).toEqual(
      expect.objectContaining({
        caseCaption: expect.any(String),
        partyType: expect.any(String),
        petitioners: expect.any(String),
        receivedAt: expect.any(String),
      }),
    );
  });
});
