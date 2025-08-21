import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setCaseCaption', () => {
  it('should set the case caption and update the case title', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    updatedCase.setCaseCaption('A whole new caption');

    expect(updatedCase.caseCaption).toEqual('A whole new caption');
  });

  it('should set the case caption on a single case in the consolidated case array', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        consolidatedCases: [
          {
            caseCaption: 'Original caption',
            docketNumber: MOCK_CASE.docketNumber,
          },
          {
            caseCaption: 'Case Caption Not Set',
            docketNumber: '123-45',
          },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    updatedCase.setCaseCaption('A whole new caption');

    expect(updatedCase.consolidatedCases[0].caseCaption).toEqual(
      'A whole new caption',
    );
    expect(updatedCase.consolidatedCases[1].caseCaption).toEqual(
      'Case Caption Not Set',
    );
  });
});
