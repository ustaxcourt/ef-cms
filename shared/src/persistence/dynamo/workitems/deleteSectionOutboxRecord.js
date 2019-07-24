const client = require('../../dynamodbClientService');

exports.deleteSectionOutboxRecord = ({
  applicationContext,
  createdAt,
  section,
}) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `section-outbox-${section}`,
      sk: createdAt,
    },
  });
};
