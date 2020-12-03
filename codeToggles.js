// This file is a map of github issue numbers with booleans
// TODO: move to a modifiable location such as S3 or DynamoDB
const toggles = {
  6506: true,
  6841: true,
  6868: true,
  6915: true,
  6916: true,
  6921: true,
  6929: true,
  6933: true,
  6934: true,
  6936: true,
  6938: true,
  6979: true,
  7015: true,
  7022: true,
  7029: true,
  7072: true,
  7080: true,
  7134: true,
  7136: true,
  7137: true,
  7142: true,
  7164: true,
  7178: false,
  7198: false,
};

exports.isCodeEnabled = issueNumber => toggles[issueNumber];
exports.isCodeDisabled = issueNumber => !toggles[issueNumber];
