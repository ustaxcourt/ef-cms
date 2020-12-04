// This file is a map of github issue numbers with booleans
// TODO: move to a modifiable location such as S3 or DynamoDB
const toggles = {};

exports.isCodeEnabled = issueNumber => toggles[issueNumber];
exports.isCodeDisabled = issueNumber => !toggles[issueNumber];
