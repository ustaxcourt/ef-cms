import promiseRetry from 'promise-retry';

function convertBytesToString(pdfBytes: number[]): string {
  const chunkSize = 10000;
  let resultString = '';
  for (let i = 0; i < pdfBytes.length; i += chunkSize) {
    let chunk = pdfBytes.slice(i, i + chunkSize);
    resultString += String.fromCharCode.apply(null, chunk);
  }

  return resultString;
}

function handleAdobeAdditionalMetadata(pdfBytes: number[]): BlobPart {
  try {
    let resultString = convertBytesToString(pdfBytes);

    ['photoshop:AuthorsPosition', 'photoshop:CaptionWriter', 'pdf:Keywords']
      .map(tag => [`<${tag}>`, `</${tag}>`])
      .forEach(([startTag, endTag]) => {
        const startIndex = resultString.indexOf(startTag);
        if (startIndex === -1) return;
        const endIndex = resultString.indexOf(endTag, startIndex);
        if (endIndex === -1) return;
        const length = endIndex - startIndex - startTag.length;
        const replacement = ' '.repeat(length);
        resultString =
          resultString.slice(0, startIndex + startTag.length) +
          replacement +
          resultString.slice(endIndex);
      });

    const modifiedPdfBytes = new Uint8Array(resultString.length);
    for (let i = 0; i < resultString.length; i++) {
      modifiedPdfBytes[i] = resultString.charCodeAt(i);
    }

    return modifiedPdfBytes;
  } catch (_) {
    return pdfBytes as unknown as BlobPart;
  }
}

export const cleanFileMetadata = async (
  title: string,
  pdfLib,
  fileReader: FileReader,
) => {
  const pdfDoc = await pdfLib.PDFDocument.load(fileReader.result, {
    updateMetadata: false,
  });

  const cleanValue = '';
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(cleanValue);
  pdfDoc.setSubject(cleanValue);

  pdfDoc.setKeywords([]);

  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const nowDateString = new Date();
  pdfDoc.setCreationDate(nowDateString);
  pdfDoc.setModificationDate(nowDateString);

  const modifiedPdfBytes: number[] = await pdfDoc.save();
  const finalModifiedPdfBytes: BlobPart =
    handleAdobeAdditionalMetadata(modifiedPdfBytes);

  return finalModifiedPdfBytes;
};

export const readAndCleanFileMetadata = async (
  title: string,
  file: File,
  pdfLib,
): Promise<File> => {
  if (!pdfLib) return file;

  return await new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.addEventListener('load', async () => {
      const pdfBytes = await cleanFileMetadata(title, pdfLib, fileReader);
      const updatedFile = new File([pdfBytes as BlobPart], file.name, {
        type: file.type,
      });

      resolve(updatedFile);
    });
    fileReader.addEventListener('error', () => reject('Failed to read file'));
  });
};

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
  const pdfLib = await applicationContext.getPdfLib().catch(() => null);
  const updatedFile = await readAndCleanFileMetadata(key, file, pdfLib).catch(
    () => file,
  );

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
  formData.append('content-type', updatedFile.type || 'application/pdf');
  formData.append('file', updatedFile, updatedFile.name || 'fileName');

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
        .catch(retry);
    },
    {
      retries: 5,
    },
  );

  return docId;
};
