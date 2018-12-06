const { S3 } = require('aws-sdk');
const axios = require('axios');

/**
 * getS3
 * @param region
 * @param s3Endpoint
 * @returns {S3}
 */
const getS3 = ({ region, s3Endpoint }) => {
  return new S3({
    region,
    s3ForcePathStyle: true,
    endpoint: s3Endpoint,
  });
};

/**
 * getDownloadPolicyUrl
 * @param documentId
 * @param applicationContext
 * @returns {Promise<any>}
 */
// exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
//   return new Promise((resolve, reject) => {
//     getS3(applicationContext.environment).getSignedUrl(
//       'getObject',
//       {
//         Bucket: applicationContext.environment.documentsBucketName,
//         Key: documentId,
//         Expires: 120,
//       },
//       (err, data) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve({
//           url: data,
//         });
//       },
//     );
//   });
// };

/**
 * createUploadPolicy
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.createUploadPolicy = ({ applicationContext }) =>
  new Promise((resolve, reject) => {
    getS3(applicationContext.environment).createPresignedPost(
      {
        Bucket: applicationContext.environment.documentsBucketName,
        Conditions: [
          ['starts-with', '$key', ''],
          ['starts-with', '$Content-Type', ''],
        ],
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      },
    );
  });

/**
 * getDocumentPolicy
 * @param applicationContext
 * @returns {Promise<*>}
 */
const getDocumentUploadPolicy = async ({ applicationContext }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/uploadPolicy`,
  );
  return response.data;
};

/**
 * uploadPdf
 * @param policy
 * @param file
 * @returns {Promise<*>}
 */
const uploadPdf = async ({ policy, file }) => {
  const documentId = uuidv4();
  const formData = new FormData();
  formData.append('key', documentId);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('Content-Type', 'application/pdf');
  formData.append('file', file, file.name || 'fileName');
  await axios.post(policy.url, formData, {
    headers: {
      /* eslint no-underscore-dangle: ["error", {"allow": ["_boundary"] }] */
      'content-type': `multipart/form-data; boundary=${formData._boundary}`,
    },
  });
  return documentId;
};

exports.uploadPdfsForNewCase = async ({
  applicationContext,
  caseInitiator,
  fileHasUploaded,
}) => {
  const policy = await getDocumentUploadPolicy({ applicationContext });

  const petitionDocumentId = await uploadPdf({
    policy,
    file: caseInitiator.petitionFile,
  });
  fileHasUploaded();

  const requestForPlaceOfTrialDocumentId = await uploadPdf({
    policy,
    file: caseInitiator.requestForPlaceOfTrial,
  });
  fileHasUploaded();

  const statementOfTaxpayerIdentificationNumberDocumentId = await uploadPdf({
    policy,
    file: caseInitiator.statementOfTaxpayerIdentificationNumber,
  });
  fileHasUploaded();

  return {
    petitionDocumentId,
    requestForPlaceOfTrialDocumentId,
    statementOfTaxpayerIdentificationNumberDocumentId,
  };
};
