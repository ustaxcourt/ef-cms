const DEFAULT = {};

export const changeOfAddressTableDefinition = {
  jobId: DEFAULT as string,
  remaining: DEFAULT as number,
};

export type ChangeOfAddressTable = typeof changeOfAddressTableDefinition;

export const DW_CHANGE_OF_ADDRESS_COLUMNS = Object.keys(
  changeOfAddressTableDefinition,
) as Array<keyof ChangeOfAddressTable>;
