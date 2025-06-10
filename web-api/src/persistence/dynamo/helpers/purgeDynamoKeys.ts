const dynamoKeys = ['pk', 'sk', 'gsi1pk', 'gsi2pk', 'ttl'];
export function purgeDynamoKeys<T, S>(obj: T): S {
  for (const property in obj) {
    if (dynamoKeys.includes(property)) {
      delete obj[property];
    } else if (typeof obj[property] === 'object') {
      obj[property] = purgeDynamoKeys(obj[property]);
    }
  }
  return obj as unknown as S;
}
