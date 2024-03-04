import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'us-east-1',
});
const bucketName = Cypress.env('SMOKETEST_BUCKET');

export const deleteAllItemsInEmailBucket = async () => {
  try {
    const objectsList = await s3.send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    );

    if (objectsList.Contents?.length === 0) return;

    const deleteObjectsParams = {
      Bucket: bucketName,
      Delete: {
        Objects: (objectsList.Contents || []).map(obj => ({ Key: obj.Key })),
      },
    };

    await s3.send(new DeleteObjectsCommand(deleteObjectsParams));
  } catch (error) {
    return null;
  }
  return null;
};

export const readAllItemsInBucket = async () => {
  try {
    const objectsList = await s3.send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    );

    if (objectsList.Contents?.length === 0) return [];

    const readPromises = (objectsList.Contents || []).map(async obj => {
      const getObjectParams = { Bucket: bucketName, Key: obj.Key };
      const objectData = await s3.send(new GetObjectCommand(getObjectParams));
      const content = await streamToBuffer(objectData.Body);
      return {
        LastModified: obj.LastModified,
        content: content.toString('utf-8'),
        key: obj.Key,
      };
    });

    const results = await Promise.all(readPromises);
    const sortedResults = results.sort((a, b) => {
      if (!a.LastModified) return 0;
      if (!b.LastModified) return 0;
      return b.LastModified.getTime() - a.LastModified.getTime();
    });
    return sortedResults;
  } catch (error) {
    return [];
  }
};

const streamToBuffer = async (stream: any) => {
  if (!stream) return [];
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
