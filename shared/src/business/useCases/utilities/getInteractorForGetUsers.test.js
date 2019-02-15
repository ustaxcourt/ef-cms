const { getInteractorForGetUsers } = require('./getInteractorForGetUsers');

describe('getInteractorForGetUsers', () => {
  beforeEach(() => {});

  it('should return an error if section is not defined', async () => {
    let error;
    try {
      await getInteractorForGetUsers({});
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
