const { getDocument } = require('./getDocument');
const { User } = require('../../business/entities/User');

const getObjectMock = jest.fn();

describe('getDocument', () => {
  it('returns the expected file Blob which is returned from persistence', async () => {
    const BLOB_DATA = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getCurrentUser: () => {
        return { role: User.ROLES.petitioner, userId: 'petitioner' };
      },
      getCurrentUserToken: () => {
        return '';
      },
      getHttpClient: () => {
        const fun = () => ({
          data: BLOB_DATA,
        });
        fun.get = () => ({
          data: 'http://localhost',
        });
        return fun;
      },
      getPersistenceGateway: () => ({
        uploadPdf: () => BLOB_DATA,
      }),
    };
    const result = await getDocument({
      applicationContext,
    });
    expect(result).toEqual(new Blob([BLOB_DATA], { type: 'application/pdf' }));
  });

  it('calls S3.getObject when S3 protocol is set', async () => {
    let applicationContext = {
      environment: {
        documentsBucketName: 'testbucket',
      },
      getStorageClient: () => ({
        getObject: getObjectMock,
      }),
    };
    await getDocument({
      applicationContext,
      protocol: 'S3',
    });
    expect(getObjectMock).toHaveBeenCalled();
  });
});
