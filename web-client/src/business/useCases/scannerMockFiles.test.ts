import { image1 } from './scannerMockFiles';

describe('image1', () => {
  it('is an image in string format', () => {
    expect(typeof image1).toEqual('string');
  });
});
