const dynamoKeys = ['pk', 'sk', 'gsi1pk', 'gsiUserBox', 'gsiSectionBox', 'ttl'];
export function purgeDynamoKeys<T>(obj: T): T {
  for (const property in obj) {
    if (dynamoKeys.includes(property)) {
      delete obj[property];
    } else if (typeof obj[property] === 'object') {
      obj[property] = purgeDynamoKeys(obj[property]);
    }
  }
  return obj;
}
