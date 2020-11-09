// connect to S3 documents bucket
// get all the documents in S3
// for each document
//   scrapePdfContents
//   save the text content to S3 with a documentContentsId as the file name
//   add documentContentsId to the docket entry (this will trigger update in ES)

const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { EFCMS_DOMAIN, ENV, REGION } = process.env;

check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(REGION, 'You must have REGION set in your environment');
check(ENV, 'You must have ENV set in your environment');

const run = async () => {
  const storageClient = new AWS.S3({
    endpoint: 's3.us-east-1.amazonaws.com',
    region: 'us-east-1',
    s3ForcePathStyle: true,
  });

  const { Contents, IsTruncated } = await storageClient
    .listObjectsV2({
      Bucket: `${EFCMS_DOMAIN}-documents-${ENV}-${REGION}`,
      MaxKeys: 1000,
    })
    .promise();
};

run();
