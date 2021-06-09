import { getStampBoxCoordinates } from './getStampBoxCoordinates';

describe('getStampBoxCoordinates', () => {
  const baseArguments = {
    bottomLeftBoxCoordinates: {
      x: 49,
      y: 27,
    },
    cropBox: {
      x: 10,
      y: 20,
    },
    pageHeight: 150,
    pageRotation: 0,
    pageWidth: 100,
  };

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 0 degrees', () => {
    const result = getStampBoxCoordinates(baseArguments);

    expect(result).toEqual({
      x: 59,
      y: 47,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 90 degrees', () => {
    const result = getStampBoxCoordinates({
      ...baseArguments,
      pageRotation: 90,
    });

    expect(result).toEqual({
      x: 73,
      y: 49,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 180 degrees', () => {
    const result = getStampBoxCoordinates({
      ...baseArguments,
      pageRotation: 180,
    });

    expect(result).toEqual({
      x: 51,
      y: 123,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 270 degrees', () => {
    const result = getStampBoxCoordinates({
      ...baseArguments,
      pageRotation: 270,
    });

    expect(result).toEqual({
      x: 26.99999999999999,
      y: 101,
    });
  });
});
