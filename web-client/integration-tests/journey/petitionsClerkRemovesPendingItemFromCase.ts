import { removePendingItemFromCase } from './removePendingItemFromCase';

export const petitionsClerkRemovesPendingItemFromCase = cerebralTest => {
  const clerkName = 'Petitions Clerk';
  return removePendingItemFromCase(cerebralTest, clerkName);
};
