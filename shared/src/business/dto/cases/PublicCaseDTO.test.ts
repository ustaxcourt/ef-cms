import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
  PARTY_TYPES,
  CONTACT_TYPES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { mockIrsPractitionerUser } from '@shared/test/mockAuthUsers';

describe('PublicCaseDTO', () => {
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
  it('should create a PublicCaseDTO without options', () => {
    const publicCaseDTO = new PublicCaseDTO(mock_publicCase.toRawObject());
    expect(publicCaseDTO).toMatchObject({
      ...mock_publicCase.toRawObject(),
      entityName: 'PublicCaseDTO',
    });
  });
  it('should create a PublicCaseDTO with options', () => {
    const publicCaseDTO = new PublicCaseDTO(mock_publicCase.toRawObject(), {
      authorizedUser: mockIrsPractitionerUser,
    });
    expect(publicCaseDTO).toMatchObject({
      ...mock_publicCase.toRawObject(),
      entityName: 'PublicCaseDTO',
    });
  });
});
