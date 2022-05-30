import { getView } from './viewFactory';

describe('viewFactory', () => {
  it('returns a map of components when invoked', () => {
    expect(getView('Button')).toBeDefined();
  });
});
