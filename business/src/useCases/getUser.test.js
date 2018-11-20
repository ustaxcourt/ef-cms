const assert = require('assert');

const getUser = require('./getUser');

describe('Get user', () => {
  it('Success taxpayer', async () => {
    const user = getUser('taxpayer');
    assert.equal(user.userId, 'taxpayer');
    assert.equal(user.role, 'taxpayer');
  });
  it('Success petitionsclerk', async () => {
    const user = getUser('petitionsclerk');
    assert.equal(user.userId, 'petitionsclerk');
    assert.equal(user.role, 'petitionsclerk');
  });
  it('Failure', async () => {
    try {
      getUser('Bad actor');
    } catch (e) {
      assert.equal(e.message, 'Username is incorrect');
    }
  });
});
