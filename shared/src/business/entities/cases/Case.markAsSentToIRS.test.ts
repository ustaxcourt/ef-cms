import { CASE_STATUS_TYPES, CONTACT_TYPES } from '../EntityConstants';
import { Case } from './Case';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('markAsSentToIRS', () => {
  it('updates case status to general docket not at issue', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    caseRecord.markAsSentToIRS();
    expect(caseRecord.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it('sets the contactType to petitioner for all primary, secondary and other petitioners', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    caseRecord.markAsSentToIRS();

    expect(caseRecord.petitioners[0].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
    expect(caseRecord.petitioners[5].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
  });

  it('does not change the contactType for intervenors and participants', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    caseRecord.markAsSentToIRS();

    expect(caseRecord.petitioners[1].contactType).toEqual(
      CONTACT_TYPES.participant,
    );
  });
});
