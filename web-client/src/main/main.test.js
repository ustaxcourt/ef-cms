import { CerebralTest } from 'cerebral/test';
import assert from 'assert';
import nock from 'nock';

import mainModule from './';
import environment from '../environments/dev';

mainModule.providers.environment = environment;
const test = CerebralTest(mainModule);

describe('Main cerebral module', () => {
  it('Start with silence', () => {
    assert.equal(test.getState('response'), 'Silence!');
  });

  it('Shows Hello World success', async () => {
    nock('http://localhost:8080')
      .get('/hello')
      .reply(200, 'Hello World!');
    await test.runSequence('getHello');
    assert.equal(test.getState('response'), 'Hello World!');
  });

  it('Shows Hello World failure', async () => {
    nock('http://localhost:8080')
      .get('/hello')
      .reply(500);
    await test.runSequence('getHello');
    assert.equal(test.getState('response'), 'Bad response!');
  });

  it('Shows Trivia success', async () => {
    nock('http://localhost:8080')
      .get('/trivia')
      .reply(200, 'Today');
    await test.runSequence('getTrivia');
    assert.equal(test.getState('response'), 'Today');
  });

  it('Shows Trivia failure', async () => {
    nock('http://localhost:8080')
      .get('/trivia')
      .reply(500);
    await test.runSequence('getTrivia');
    assert.equal(test.getState('response'), 'Bad response!');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), true);
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), false);
  });
});
