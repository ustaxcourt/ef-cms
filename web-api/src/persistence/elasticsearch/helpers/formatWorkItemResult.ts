import { unmarshall } from '@aws-sdk/util-dynamodb';

export const formatWorkItemResult = ({ caseMap, hit, sourceUnmarshalled }) => {
  const casePk = hit['_id'].split('_')[0];
  const docketNumber = casePk.replace('case|', '');

  let foundCase = caseMap[docketNumber];

  if (!foundCase) {
    hit.inner_hits['case-mappings'].hits.hits.some(innerHit => {
      const innerHitDocketNumber = innerHit['_source'].docketNumber.S;
      caseMap[innerHitDocketNumber] = innerHit['_source'];

      if (innerHitDocketNumber === docketNumber) {
        foundCase = innerHit['_source'];
        return true;
      }
    });
  }

  if (foundCase) {
    const foundCaseUnmarshalled = unmarshall(foundCase);

    return {
      ...foundCaseUnmarshalled,
      ...sourceUnmarshalled,
    };
  } else {
    return sourceUnmarshalled;
  }
};
