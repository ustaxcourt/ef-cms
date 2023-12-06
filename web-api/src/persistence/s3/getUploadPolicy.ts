import { MAX_FILE_SIZE_BYTES } from '../../../../shared/src/business/entities/EntityConstants';

/**
 * getUploadPolicy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the call to the storage client
 */
export const getUploadPolicy = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
  key: string;
}) =>
  new Promise((resolve, reject) => {
    applicationContext.getStorageClient().createPresignedPost(
      {
        Bucket: applicationContext.getDocumentsBucketName(),
        Conditions: [
          ['starts-with', '$key', key],
          ['starts-with', '$Content-Type', ''],
          ['content-length-range', 0, MAX_FILE_SIZE_BYTES],
        ],
      },
      (err, data) => {
        if (err) {
          applicationContext.logger.error(
            'unable to create the upload policy url',
            err,
          );
          return reject(err);
        }
        resolve(data);
      },
    );
  });
