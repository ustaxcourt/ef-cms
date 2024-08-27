import { Case, getContactPrimary, isAssociatedUser } from './Case';
import { INITIAL_DOCUMENT_TYPES, PARTY_TYPES, ROLES } from '../EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('isAssociatedUser', () => {
  let caseEntity;
  const CONTACT_ID = '3855b2dd-4094-4526-acc0-b48d7eed1f28';

  beforeEach(() => {
    caseEntity = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [{ userId: '4c644ac6-e5bc-4905-9dc8-d658f25a8e72' }],
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: CONTACT_ID,
          },
        ],
        privatePractitioners: [
          { userId: '271e5918-6461-4e67-bc38-274bc0aa0248' },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
  });

  it('returns true if the user is an irsPractitioner on the case', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: {
        role: ROLES.irsPractitioner,
        userId: '4c644ac6-e5bc-4905-9dc8-d658f25a8e72',
      },
    });

    expect(isAssociated).toBeTruthy();
  });

  it('returns true if the user is a privatePractitioner on the case', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: {
        role: ROLES.privatePractitioner,
        userId: '271e5918-6461-4e67-bc38-274bc0aa0248',
      },
    });

    expect(isAssociated).toBeTruthy();
  });

  it('returns false if the user is an irs superuser but the petition document is not served', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: {
        role: ROLES.irsSuperuser,
        userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
      },
    });

    expect(isAssociated).toBeFalsy();
  });

  it('returns true if the user is an irs superuser and the petition document is served', () => {
    caseEntity.docketEntries = [
      {
        documentType: 'Petition',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    ];

    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: {
        role: ROLES.irsSuperuser,
        userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
      },
    });

    expect(isAssociated).toBeTruthy();
  });

  it('returns false if the user is an irs superuser and the case does not have docketEntries', () => {
    caseEntity.docketEntries = undefined;

    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity,
      user: {
        role: ROLES.irsSuperuser,
        userId: '098d5055-dd90-42af-aec9-056a9843a7e0',
      },
    });

    expect(isAssociated).toBeFalsy();
  });

  it('returns false if the user is not a privatePractitioner or irsPractitioner on the case and is not an irs superuser', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: {
        role: ROLES.docketClerk,
        userId: '4b32e14b-f583-4631-ba44-1439a093d6d0',
      },
    });

    expect(isAssociated).toBeFalsy();
  });

  it('returns true if the user is the contact on the case', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: caseEntity.toRawObject(),
      user: { role: ROLES.petitioner, userId: CONTACT_ID },
    });

    expect(isAssociated).toBeTruthy();
  });

  it('should return true when the petition docket entry has been served in the legacy system and the current user is an irs superuser', () => {
    const isAssociated = isAssociatedUser({
      caseRaw: {
        ...caseEntity.toRawObject(),
        docketEntries: [
          {
            documentTitle: 'Petition',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
            isLegacyServed: true,
            servedAt: undefined,
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      },
      user: {
        role: ROLES.irsSuperuser,
        userId: 'c28ba201-3039-4612-884b-065255154c38',
      },
    });

    expect(isAssociated).toBeTruthy();
  });
});
