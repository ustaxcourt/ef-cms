export const getTextByCount = count => {
  const baseText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate efficitur ante, at placerat.';
  const baseCount = baseText.length;

  let resultText = baseText;
  if (count > baseCount) {
    for (let i = 1; i < Math.ceil(count / baseCount); i++) {
      resultText += baseText;
    }
  }

  return resultText.slice(0, count);
};
