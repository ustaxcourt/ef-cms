const AWS = require('aws-sdk');

exports.formatWorkItemResult = ({ caseMap, hit, sourceUnmarshalled }) => {
  const casePk = hit['_id'].split('_')[0];
  const docketNumber = casePk.replace('case|', '');

  //   console.log(
  //     '========================= I HAVE BEEN CALLED ==============================',
  //   );

  //   console.log(':::::hits.inner_hits::::::', hit.inner_hits['case-mappings']);

  let foundCase = caseMap[docketNumber];

  if (!foundCase) {
    // console.log(
    //   '========================= CASE NOT FOUND ==============================',
    // );
    hit.inner_hits['case-mappings'].hits.hits.some(innerHit => {
      const innerHitDocketNumber = innerHit['_source'].docketNumber.S;
      caseMap[innerHitDocketNumber] = innerHit['_source'];

      if (innerHitDocketNumber === docketNumber) {
        foundCase = innerHit['_source'];
        return true;
      }
    });
  }

  //   console.log('foundCase::::::::', foundCase); // comes back undefined and should be foundCase:::::: { leadDocketNumber: { S: '111-19' }, docketNumber: { S: '111-19' } }

  if (foundCase) {
    // console.log(
    //   '========================= CASE FOUND ==============================',
    // );
    const foundCaseUnmarshalled = AWS.DynamoDB.Converter.unmarshall(foundCase);

    return {
      ...foundCaseUnmarshalled,
      ...sourceUnmarshalled,
    };
  } else {
    return sourceUnmarshalled;
  }
};
