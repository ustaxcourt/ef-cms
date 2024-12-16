import React from 'react';

export const MinutesSheet = ({
  minutesSheetData,
}: {
  minutesSheetData: string;
}) => {
  return (
    <>
      <h1>{`Minutes Sheet ${minutesSheetData}`}</h1>
    </>
  );
};
