// This file is a map of github issue numbers with booleans
// TODO: move to a modifiable location such as S3 or DynamoDB
const toggles = {
  6936: true,
  7142: true,
  7178: true,
  7198: true,
};

exports.isCodeEnabled = issueNumber => toggles[issueNumber];
exports.isCodeDisabled = issueNumber => !toggles[issueNumber];
