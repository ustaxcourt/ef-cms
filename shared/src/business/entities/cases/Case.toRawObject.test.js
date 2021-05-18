const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');

describe('toRawObject', () => {
  beforeEach(() => {
    jest.spyOn(Case.prototype, 'doesHavePendingItems');
  });

  afterEach(() => {
    Case.prototype.doesHavePendingItems.mockRestore();
  });

  it('calls own function to update values after decorated toRawObject', () => {
    const myCase = new Case({}, { applicationContext });

    const result = myCase.toRawObject();

    expect(Case.prototype.doesHavePendingItems).toHaveBeenCalled();
    expect(result.hasPendingItems).toBeFalsy();
  });

  it('does not call own function to update values if flag is set to false after decorated toRawObject', () => {
    const myCase = new Case({}, { applicationContext });
    const result = myCase.toRawObject(false);

    expect(Case.prototype.doesHavePendingItems).not.toHaveBeenCalled();
    expect(result.hasPendingItems).toBeFalsy();
  });
});
