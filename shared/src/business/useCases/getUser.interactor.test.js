const assert = require('assert');

const { getUser } = require('./getUser.interactor');

describe('Get user', () => {
  it('Success taxpayer', async () => {
    const user = await getUser('taxpayer');
    assert.equal(user.userId, 'taxpayer');
    assert.equal(user.role, 'petitioner');
  });
  it('Success petitionsclerk', async () => {
    const user = await getUser('petitionsclerk');
    assert.equal(user.userId, 'petitionsclerk');
    assert.equal(user.role, 'petitionsclerk');
  });
  it('Success intakeclerk', async () => {
    const user = await getUser('intakeclerk');
    assert.equal(user.userId, 'intakeclerk');
    assert.equal(user.role, 'intakeclerk');
  });
  it('Failure', async () => {
    try {
      await getUser('Bad actor');
    } catch (e) {
      assert.equal(e.message, 'Username is incorrect');
    }
  });
});
