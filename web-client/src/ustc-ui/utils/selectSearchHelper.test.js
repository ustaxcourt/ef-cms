import { getSortedOptions } from './selectSearchHelper';

describe('getSortedOptions', () => {
  const optionsForDropdown = Object.freeze([
    { label: 'Bananas', value: 'BA' },
    { label: 'Craps', value: 'C' },
    { label: 'Carrots', value: 'CA' },
    { label: 'Baccarat', value: 'B' },
  ]);
  const optionsWithLabels = Object.freeze([
    { label: 'Banana Bread', value: 'BB' },
    { label: 'Carrot Cake', value: 'CC' },
    { label: 'Carrot', value: 'C' },
    { label: 'Bread', value: 'B' },
  ]);

  it('returns options unchanged and unsorted when no search text is provided', () => {
    const results = getSortedOptions(optionsForDropdown, undefined);
    expect(results).toMatchObject(optionsForDropdown);

    const results2 = getSortedOptions(optionsForDropdown, '');
    expect(results2).toMatchObject(optionsForDropdown);
  });

  it('returns options sorted with exact match value first, followed by "starts with" matches and then others according to original order even when results are not alphabetical', () => {
    const results = getSortedOptions(optionsForDropdown, 'c');
    expect(results).toMatchObject([
      { label: 'Craps', value: 'C' },
      { label: 'Carrots', value: 'CA' },
      { label: 'Bananas', value: 'BA' },
      { label: 'Baccarat', value: 'B' },
    ]);
  });
  it('returns options sorted with exact match value first, followed by "starts with" matches and then others according to original order', () => {
    const results = getSortedOptions(optionsForDropdown, 'b');
    expect(results).toMatchObject([
      { label: 'Baccarat', value: 'B' },
      { label: 'Bananas', value: 'BA' },
      { label: 'Craps', value: 'C' },
      { label: 'Carrots', value: 'CA' },
    ]);
  });
  it('returns options sorted with exact match label sorted first', () => {
    const results = getSortedOptions(optionsWithLabels, 'bread');
    expect(results).toMatchObject([
      { label: 'Bread', value: 'B' },
      { label: 'Banana Bread', value: 'BB' },
      { label: 'Carrot Cake', value: 'CC' },
      { label: 'Carrot', value: 'C' },
    ]);
  });
});
