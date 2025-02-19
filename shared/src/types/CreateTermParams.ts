export type CreateTermParams = {
  termEndDate: string;
  termStartDate: string;
  maxSessionsPerLocation: number;
  maxSessionsPerWeek: number;
  smallCaseMinimumQuantity: number;
  smallCaseMaxQuantity: number;
  regularCaseMinimumQuantity: number;
  regularCaseMaxQuantity: number;
  hybridCaseMinimumQuantity: number;
  hybridCaseMaxQuantity: number;
};
