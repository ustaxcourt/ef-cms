import { DeadlineSearch } from './DeadlineSearch';

describe('DeadlineSearch', () => {
  it('creates a deadline search and initializes it', () => {
    const deadlineSearchEntity = new DeadlineSearch({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });

    expect(deadlineSearchEntity.entityName).toEqual('DeadlineSearch');
    expect(deadlineSearchEntity.validate().toRawObject()).toMatchObject({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });
  });
});
