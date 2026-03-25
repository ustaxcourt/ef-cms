export const userDataCanGenerateValidBarNumber = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): boolean => {
  const startsWithLetter = /^[a-zA-Z]/;
  return startsWithLetter.test(firstName) && startsWithLetter.test(lastName);
};
