import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('getIrsSendDate', () => {
  it('should get the IRS send date from the petition docket entry', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    const result = myCase.getIrsSendDate();
    expect(result).toEqual('2019-03-01T21:40:46.415Z');
  });

  it('should return undefined for irsSendDate if the petition docket entry is not served', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [{ documentType: 'Petition' }],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    const result = myCase.getIrsSendDate();
    expect(result).toBeUndefined();
  });

  it('should return undefined for irsSendDate if the petition docket entry is not found', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          { documentType: 'Answer', servedAt: '2019-03-01T21:40:46.415Z' },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    const result = myCase.getIrsSendDate();
    expect(result).toBeUndefined();
  });
});
