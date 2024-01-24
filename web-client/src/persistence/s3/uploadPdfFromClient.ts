import promiseRetry from 'promise-retry';

/**
 * uploadPdfFromClient
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.file the file to upload
 * @param {Function} providers.onUploadProgress the upload progress function
 * @param {object} providers.policy the upload policy
 * @returns {string} the document id
 */
export const uploadPdfFromClient = async ({
  applicationContext,
  file,
  key,
  onUploadProgress,
  policy,
}: {
  applicationContext: IApplicationContext;
  file: any;
  key: string;
  onUploadProgress: ({
    isDone,
    isHavingSystemIssues,
    loaded,
    total,
  }: {
    isDone?: boolean;
    loaded?: number;
    total?: number;
    isHavingSystemIssues?: boolean;
  }) => void;
  policy: any;
}) => {
  const docId = key;
  const formData = new FormData();
  formData.append('key', docId);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('content-type', file.type || 'application/pdf');
  formData.append('file', file, file.name || 'fileName');

  await promiseRetry(
    (retry, attempts) => {
      onUploadProgress({ isHavingSystemIssues: false, loaded: 0, total: 100 });

      if (attempts > 3) {
        onUploadProgress({ isHavingSystemIssues: true, loaded: 0, total: 100 });
      }
      return applicationContext
        .getHttpClient()
        .post(policy.url, formData, {
          headers: {
            /* eslint no-underscore-dangle: ["error", {"allow": ["_boundary"] }] */
            'content-type': `multipart/form-data; boundary=${
              (formData as any)._boundary
            }`,
          },
          onUploadProgress,
        })
        .then(r => {
          onUploadProgress({ isDone: true });
          return r;
        })
        .catch(async error => {
          try {
            await applicationContext
              .getUseCases()
              .logClientErrorInteractor(applicationContext, {
                error: error.message,
                method: error.config.method,
                status: error.code,
                url: error.config.url,
              });
          } catch (e) {
            console.error((e as Error).message);
          }
          return retry(error);
        });
    },
    {
      retries: 5,
    },
  );

  return docId;
};
