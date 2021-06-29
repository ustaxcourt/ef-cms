exports.getStampBoxCoordinates = ({
  bottomLeftBoxCoordinates,
  cropBox,
  pageHeight,
  pageRotation,
  pageWidth,
}) => {
  const rotationRads = (pageRotation * Math.PI) / 180;

  if (pageRotation === 90) {
    return {
      x:
        bottomLeftBoxCoordinates.x * Math.cos(rotationRads) -
        bottomLeftBoxCoordinates.y * Math.sin(rotationRads) +
        pageWidth,
      y:
        bottomLeftBoxCoordinates.x * Math.sin(rotationRads) +
        bottomLeftBoxCoordinates.y * Math.cos(rotationRads),
    };
  } else if (pageRotation === 180) {
    return {
      x:
        bottomLeftBoxCoordinates.x * Math.cos(rotationRads) -
        bottomLeftBoxCoordinates.y * Math.sin(rotationRads) +
        pageWidth,
      y:
        bottomLeftBoxCoordinates.x * Math.sin(rotationRads) +
        bottomLeftBoxCoordinates.y * Math.cos(rotationRads) +
        pageHeight,
    };
  } else if (pageRotation === 270) {
    return {
      x:
        bottomLeftBoxCoordinates.x * Math.cos(rotationRads) -
        bottomLeftBoxCoordinates.y * Math.sin(rotationRads),
      y:
        bottomLeftBoxCoordinates.x * Math.sin(rotationRads) +
        bottomLeftBoxCoordinates.y * Math.cos(rotationRads) +
        pageHeight,
    };
  } else {
    return {
      x: bottomLeftBoxCoordinates.x + cropBox.x,
      y: bottomLeftBoxCoordinates.y + cropBox.y,
    };
  }
};
