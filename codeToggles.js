// This file is a map of github issue numbers with booleans
// TODO: move to a modifiable location such as S3 or DynamoDB
const toggles = {
  6921: true,
  7072: true,
};

const isCodeEnabled = issueNumber => {
  return toggles[issueNumber];
};

module.exports.isCodeEnabled = isCodeEnabled;
