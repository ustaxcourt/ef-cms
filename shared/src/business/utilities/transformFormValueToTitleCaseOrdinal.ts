import { getOrdinal } from 'english-ordinals';

/**
 * Transforms a form value as a string into an ordinal, in title case
 *
 * @param  {string} formValue the formValue to transform
 * @returns {string|void} the formValue as an ordinal in title case
 */
export const transformFormValueToTitleCaseOrdinal = formValue => {
  if (!formValue) {
    return;
  }
  let splitNumberIntoWords = getOrdinal(formValue).split(' ');

  let wordWithHyphen = splitNumberIntoWords.find(word => word.includes('-'));
  if (wordWithHyphen) {
    const splitWordWithHyphenCapitalized =
      capitalizeWordAfterHyphen(wordWithHyphen);
    splitNumberIntoWords[splitNumberIntoWords.length - 1] =
      splitWordWithHyphenCapitalized;
  }

  let titleCaseOrdinal = splitNumberIntoWords
    .map(word => (word !== 'and' ? capitalizeWord(word) : word))
    .join(' ');

  return titleCaseOrdinal;
};

const capitalizeWord = word => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const capitalizeWordAfterHyphen = wordWithHyphen => {
  let splitWordWithHyphen = wordWithHyphen.split('-');
  const wordAfterHyphenCapitalized = capitalizeWord(splitWordWithHyphen[1]);
  splitWordWithHyphen[1] = wordAfterHyphenCapitalized;
  splitWordWithHyphen = splitWordWithHyphen.join('-');
  return splitWordWithHyphen;
};
