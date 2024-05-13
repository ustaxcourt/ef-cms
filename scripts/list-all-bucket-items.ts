const { S3 } = require('aws-sdk');

const s3 = new S3({
  apiVersion: 'latest',
  region: 'us-east-1',
});

// const bucketName = 'test.ef-cms.ustaxcourt.gov-temp-documents-test-us-west-1';
// const bucketName = 'test.ef-cms.ustaxcourt.gov-temp-documents-test-us-east-1';
const bucketName = 'test.ef-cms.ustaxcourt.gov-documents-test-us-east-1';
// const bucketName = 'dawson.ustaxcourt.gov-temp-documents-prod-us-east-1';
// const bucketName = 'dawson.ustaxcourt.gov-documents-prod-us-east-1';

let allKeys = [];
let pagenum = 0;
function listAllKeys(token, cb) {
  let opts = { Bucket: bucketName };
  if (token) opts.ContinuationToken = token;
  pagenum++;

  s3.listObjectsV2(opts, function (err, data) {
    allKeys = allKeys.concat(data.Contents);
    console.log(
      `grabbing page ${pagenum} of results with ${data.Contents?.length} records`,
    );
    if (data.IsTruncated) listAllKeys(data.NextContinuationToken, cb);
    else cb();
  });
}

function echoKeys(keys) {
  // let keys = allKeys.map(obj => obj.Key);
  keys.forEach(obj => {
    console.log(obj.Key);
  });
}

function listAllKeys2(token, cb) {
  let opts = { Bucket: bucketName };
  if (token) opts.ContinuationToken = token;

  s3.listObjectsV2(opts, function (err, data) {
    pagenum++;
    // allKeys = allKeys.concat(data.Contents);
    echoKeys(data.Contents);
    // console.log(
    //   `grabbing page ${pagenum} of results with ${data.Contents?.length} records`,
    // );
    if (data.IsTruncated) listAllKeys2(data.NextContinuationToken, cb);
    else cb();
  });
}

listAllKeys2(undefined, () => {
  // let keys = allKeys.map(obj => obj.Key);
  // keys.forEach(key => {
  //   console.log(key);
  // });
});
