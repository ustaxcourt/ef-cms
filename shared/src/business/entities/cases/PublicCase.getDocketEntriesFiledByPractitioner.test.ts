import { MOCK_CASE } from '../../../test/mockCase';

import { PublicCase } from './PublicCase';

describe('PublicCase getDocketEntriesEFiledByPractitioner', () => {
  const mockPractitionerId = '49e55257-1b86-48a0-91ab-ec3f0570169d';
  const rawCase = {
    ...MOCK_CASE,
    docketEntries: [
      { ...MOCK_CASE.docketEntries[0], userId: mockPractitionerId },
    ],
    privatePractitioners: [{ userId: mockPractitionerId }],
  };

  it('should return a list of docket entry ids associated with practitioner e-filed docs', () => {
    const docketEntriesListFiledByPractitioner =
      PublicCase.getDocketEntriesEFiledByPractitioner(rawCase);

    expect(docketEntriesListFiledByPractitioner).toEqual([
      MOCK_CASE.docketEntries[0].docketEntryId,
    ]);
  });
});
