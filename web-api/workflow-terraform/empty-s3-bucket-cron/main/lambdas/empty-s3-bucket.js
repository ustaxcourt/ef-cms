const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectVersionsCommand,
  S3Client,
} = require('@aws-sdk/client-s3');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const jobName = 'wait-for-s3-bucket-to-empty';
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const documentsBucket = process.env.DOCUMENTS_BUCKET_NAME;

const s3Client = new S3Client({});

exports.handler = async (input, context) => {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: documentsBucket,
    MaxKeys: 1000,
  });
  const listObjectVersionsCommand = new ListObjectVersionsCommand({
    Bucket: documentsBucket,
    MaxKeys: 1000,
  });
  const listDeleteMarkersCommand = new ListObjectVersionsCommand({
    Bucket: documentsBucket,
    MaxKeys: 1000,
  });
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: documentsBucket,
    Delete: { Objects: [] },
  });

  let remainingTimeInMillis = context.getRemainingTimeInMillis();
  let i = 0;
  while (remainingTimeInMillis > 2000) {
    i++;
    console.time(`iteration ${i}`);
    let objectsChunk;
    try {
      const listObjectsResponse = await s3Client.send(listObjectsCommand);
      if ('Contents' in listObjectsResponse) {
        objectsChunk = listObjectsResponse.Contents;
      }
      if ('NextContinuationToken' in listObjectsResponse) {
        listObjectsCommand.input.ContinuationToken =
          listObjectsResponse.NextContinuationToken;
      }
    } catch (err) {
      console.error('Error listing bucket contents', err);
    }
    if (objectsChunk && objectsChunk.length) {
      deleteObjectsCommand.input.Delete.Objects = objectsChunk.map(object => {
        return { Key: object.Key };
      });
      try {
        const { Deleted: deletedObjects } = await s3Client.send(
          deleteObjectsCommand,
        );
        console.log(`Deleted ${deletedObjects.length} objects`);
      } catch (err) {
        console.error('Error deleting objects', err);
      }
    } else {
      console.log('No objects left to delete');

      let objectVersionsChunk;
      try {
        const listObjectVersionsResponse = await s3Client.send(
          listObjectVersionsCommand,
        );
        if ('Versions' in listObjectVersionsResponse) {
          objectVersionsChunk = listObjectVersionsResponse.Versions;
        }
        if ('NextKeyMarker' in listObjectVersionsResponse) {
          listObjectVersionsCommand.input.KeyMarker =
            listObjectVersionsResponse.NextKeyMarker;
        }
      } catch (err) {
        console.error('Error listing object versions', err);
      }
      if (objectVersionsChunk && objectVersionsChunk.length) {
        deleteObjectsCommand.input.Delete.Objects = objectVersionsChunk.map(
          objectVersion => {
            return {
              Key: objectVersion.Key,
              VersionId: objectVersion.VersionId,
            };
          },
        );
        try {
          const { Deleted: deletedObjectVersions } = await s3Client.send(
            deleteObjectsCommand,
          );
          console.log(`Deleted ${deletedObjectVersions.length} versions`);
        } catch (err) {
          console.error('Error deleting object versions', err);
        }
      } else {
        console.log('No object versions left to delete');

        let deleteMarkersChunk;
        try {
          const listDeleteMarkersResponse = await s3Client.send(
            listDeleteMarkersCommand,
          );
          if ('DeleteMarkers' in listDeleteMarkersResponse) {
            deleteMarkersChunk = listDeleteMarkersResponse.DeleteMarkers;
          }
          if ('NextKeyMarker' in listDeleteMarkersResponse) {
            listDeleteMarkersCommand.input.KeyMarker =
              listDeleteMarkersResponse.NextKeyMarker;
          }
        } catch (err) {
          console.error('Error listing object versions', err);
        }
        if (deleteMarkersChunk && deleteMarkersChunk.length) {
          deleteObjectsCommand.input.Delete.Objects = deleteMarkersChunk.map(
            deleteMarker => {
              return {
                Key: deleteMarker.Key,
                VersionId: deleteMarker.VersionId,
              };
            },
          );
          try {
            const { Deleted: deletedMarkers } = await s3Client.send(
              deleteObjectsCommand,
            );
            console.log(`Deleted ${deletedMarkers.length} delete markers`);
          } catch (err) {
            console.error('Error deleting delete markers', err);
          }
        } else {
          console.log('No delete markers left to delete');
          await approvePendingJob({ apiToken, jobName, workflowId });
          console.timeEnd(`iteration ${i}`);
          return succeed({ context, results: { iterations: i } });
        }
      }
    }

    console.timeEnd(`iteration ${i}`);
    remainingTimeInMillis = context.getRemainingTimeInMillis();
  }

  return succeed({ context, results: { iterations: i } });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
