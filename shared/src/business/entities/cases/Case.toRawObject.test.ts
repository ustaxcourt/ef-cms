import { Case } from './Case';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('toRawObject', () => {
  it('passes through the stored hasPendingItems value', () => {
    const myCase = new Case(
      { hasPendingItems: true },
      { authorizedUser: mockDocketClerkUser },
    );

    const result = myCase.toRawObject();

    expect(result.hasPendingItems).toEqual(true);
  });

  it('passes through hasPendingItems as false when not set', () => {
    const myCase = new Case({}, { authorizedUser: mockDocketClerkUser });

    const result = myCase.toRawObject();

    expect(result.hasPendingItems).toEqual(false);
  });

  it('does not recompute hasPendingItems from docket entries', () => {
    const doesHavePendingItemsSpy = jest.spyOn(
      Case.prototype,
      'doesHavePendingItems',
    );

    const myCase = new Case({}, { authorizedUser: mockDocketClerkUser });
    myCase.toRawObject();

    expect(doesHavePendingItemsSpy).not.toHaveBeenCalled();

    doesHavePendingItemsSpy.mockRestore();
  });
});
