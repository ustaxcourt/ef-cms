const client = require('../../dynamodbClientService');

exports.deleteSectionOutboxRecord = ({
  applicationContext,
  section,
  createdAt,
}) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `section-outbox-${section}`,
      sk: createdAt,
    },
  });
};
