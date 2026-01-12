import { Case } from './Case';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('toRawObject', () => {
  let doesHavePendingItemsSpy: jest.SpyInstance;

  beforeEach(() => {
    doesHavePendingItemsSpy = jest.spyOn(
      Case.prototype,
      'doesHavePendingItems',
    );
  });

  afterEach(() => {
    doesHavePendingItemsSpy.mockRestore();
  });

  it('calls own function to update values after decorated toRawObject', () => {
    const myCase = new Case({}, { authorizedUser: mockDocketClerkUser });

    const result = myCase.toRawObject();

    expect(Case.prototype.doesHavePendingItems).toHaveBeenCalled();
    expect(result.hasPendingItems).toBeFalsy();
  });

  it('does not call own function to update values if flag is set to false after decorated toRawObject', () => {
    const myCase = new Case({}, { authorizedUser: mockDocketClerkUser });
    const result = myCase.toRawObject({ processPendingItems: false });

    expect(Case.prototype.doesHavePendingItems).not.toHaveBeenCalled();
    expect(result.hasPendingItems).toBeFalsy();
  });
});
