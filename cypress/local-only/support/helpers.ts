/* eslint-disable */
/**
 * @param b64Data
 * @param contentType
 * @param sliceSize
 */
export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  const blob = new Blob(byteArrays, { type: contentType });
  blob.lastModifiedDate = new Date();
  return blob;
}

export function generateRandomPhoneNumber(): string {
  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const areaCode = getRandomNumber(100, 999);
  const firstPart = getRandomNumber(100, 999);
  const secondPart = getRandomNumber(1000, 9999);
  const phoneNumber = `+1 (${areaCode}) ${firstPart}-${secondPart}`;

  return phoneNumber;
}
