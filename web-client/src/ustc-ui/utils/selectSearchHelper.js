import { cloneDeep } from 'lodash';

const getSelectSearchSortFunction = searchText => {
  const str = searchText.toUpperCase();
  return (first, second) => {
    let [a, b] = [first.value.toUpperCase(), second.value.toUpperCase()];
    if (a == str) return -1; // exact match for a
    if (b == str) return 1; // exact match for b

    // first value begins with search string but second does not
    if (a.startsWith(str) && !b.startsWith(str)) {
      return -1;
    }

    // second value begins with search string but first does not
    if (b.startsWith(str) && !a.startsWith(str)) {
      return 1;
    }
    // otherwise don't change the order
    return 0;
  };
};

/**
 * @param {Array<object>} array of objects containing `label` and `value`
 * @param {string} inputText the text being searched for
 * @returns {Array} options sorted according to input text
 */
export const getSortedOptions = function sortedOptions(options, inputText) {
  const sortedOptions = cloneDeep(options);
  if (inputText && inputText.length > 0) {
    return sortedOptions.sort(getSelectSearchSortFunction(inputText));
  } else {
    return sortedOptions;
  }
};
