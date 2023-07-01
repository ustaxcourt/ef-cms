const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');
const {
  deleteObjects,
  getNextChunkOfDeleteMarkers,
  getNextChunkOfObjects,
  getNextChunkOfObjectVersions,
} = require('../../../../../shared/admin-tools/aws/s3Helper');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const jobName = 'wait-for-s3-bucket-to-empty';
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const Bucket = process.env.DOCUMENTS_BUCKET_NAME;

exports.handler = async (input, context) => {
  let remainingTimeInMillis = context.getRemainingTimeInMillis();

  let i = 0;
  let ContinuationToken;
  let KeyMarker;
  let deleteKeyMarker;

  while (remainingTimeInMillis > 2000) {
    i++;
    console.time(`iteration ${i}`);

    const { nextContinuationToken, objectsChunk } = await getNextChunkOfObjects(
      {
        Bucket,
        ContinuationToken: ContinuationToken || undefined,
      },
    );
    ContinuationToken = nextContinuationToken;

    if (objectsChunk && objectsChunk.length) {
      const Objects = objectsChunk.map(object => {
        return { Key: object.Key };
      });
      await deleteObjects({ Bucket, Objects });
    } else {
      console.log('No objects left to delete');

      const { nextKeyMarker, objectVersionsChunk } =
        await getNextChunkOfObjectVersions({
          Bucket,
          KeyMarker: KeyMarker || undefined,
        });
      KeyMarker = nextKeyMarker;

      if (objectVersionsChunk && objectVersionsChunk.length) {
        const Objects = objectVersionsChunk.map(objectVersion => {
          return {
            Key: objectVersion.Key,
            VersionId: objectVersion.VersionId,
          };
        });
        await deleteObjects({ Bucket, Objects });
      } else {
        console.log('No object versions left to delete');

        const { deleteMarkersChunk, nextDeleteKeyMarker } =
          await getNextChunkOfDeleteMarkers({
            Bucket,
            KeyMarker: deleteKeyMarker || undefined,
          });
        deleteKeyMarker = nextDeleteKeyMarker;

        if (deleteMarkersChunk && deleteMarkersChunk.length) {
          const Objects = deleteMarkersChunk.map(deleteMarker => {
            return {
              Key: deleteMarker.Key,
              VersionId: deleteMarker.VersionId,
            };
          });
          await deleteObjects({ Bucket, Objects });
        } else {
          console.log('No delete markers left to delete');

          console.timeEnd(`iteration ${i}`);
          await approvePendingJob({ apiToken, jobName, workflowId });
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
