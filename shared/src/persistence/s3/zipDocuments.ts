import { zipS3Files } from './zipS3Files';
import archiver from 'archiver';
import s3FilesLib from 's3-files';
import stream from 'stream';

/**
 * zipDocuments
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.fileNames the names of the files to zip
 * @param {Array} providers.s3Ids the s3 ids of the files to zip
 * @param {string} providers.zipName the name of the generated zip file
 * @returns {Promise} the created zip
 */
export const zipDocuments = ({
  applicationContext,
  extraFileNames,
  extraFiles,
  fileNames,
  onEntry,
  onError,
  onProgress,
  onUploadStart,
  s3Ids,
  zipName,
}: {
  applicationContext: IApplicationContext;
  extraFileNames: string[];
  extraFiles: any[];
  fileNames: string[];
  onEntry: (entryData: any) => void;
  onError: (error: any) => void;
  onProgress: (data: any) => void;
  onUploadStart: () => void;
  s3Ids: string[];
  zipName: string;
}) => {
  return new Promise((resolve, reject) => {
    const { documentsBucketName, tempDocumentsBucketName } =
      applicationContext.environment;

    const s3Client = applicationContext.getStorageClient();

    onUploadStart?.();

    const passThrough = new stream.PassThrough();

    s3Client.upload(
      {
        Body: passThrough,
        Bucket: tempDocumentsBucketName,
        Key: zipName,
      },
      () => resolve(undefined),
    );

    passThrough.on('error', reject);

    zipS3Files({
      additionalFileNames: extraFileNames,
      additionalFiles: extraFiles,
      archiver,
      bucket: documentsBucketName,
      onEntry,
      onError,
      onProgress,
      s3Client,
      s3FilesLib,
      s3Keys: s3Ids,
      s3KeysFileNames: fileNames,
    }).pipe(passThrough);
  });
};
