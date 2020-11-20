// This file is a map of github issue numbers with booleans
// TODO: move to a modifiable location such as S3 or DynamoDB
const toggles = {
  6921: true,
  6929: true,
  7072: true,
};

export const isCodeEnabled = issueNumber => toggles[issueNumber];
export const isCodeDisabled = issueNumber => !toggles[issueNumber];
