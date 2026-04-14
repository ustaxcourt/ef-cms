export const userDataCanGenerateValidBarNumber = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): boolean => {
  const startsWithLetter = /^\p{L}/u;
  return startsWithLetter.test(firstName) && startsWithLetter.test(lastName);
};
