export const formattedOldEmailForChangeOfAddress = (
  email: string,
  isAddressSealed: boolean,
): string => {
  if (!email && isAddressSealed) {
    return ``;
  } else if (email && isAddressSealed) {
    return 'SEALED BY COURT ORDER';
  } else if (!email) {
    return 'No email provided';
  }
  return email;
};

export const formattedNewEmailForChangeOfAddress = (
  email: string,
  isAddressSealed: boolean,
): string => {
  return isAddressSealed ? 'SEALED BY COURT ORDER' : email;
};
