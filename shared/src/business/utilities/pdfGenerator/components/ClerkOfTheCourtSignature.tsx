import React from 'react';

export const ClerkOfTheCourtSignature = ({
  nameOfClerk,
  titleOfClerk,
}: {
  nameOfClerk: string;
  titleOfClerk: string;
}) => {
  return (
    <p className="float-right width-third">
      {nameOfClerk}
      <br />
      {titleOfClerk}
    </p>
  );
};
