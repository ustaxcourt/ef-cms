const { DeadlineSearch } = require('./DeadlineSearch');

describe('DeadlineSearch', () => {
  it('creates a deadline search and initializes it', () => {
    const deadlineSearchEntity = new DeadlineSearch();

    expect(deadlineSearchEntity.entityName).toEqual('DeadlineSearch');

    deadlineSearchEntity.init({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });

    expect(deadlineSearchEntity.validate().toRawObject()).toMatchObject({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });
  });
});
