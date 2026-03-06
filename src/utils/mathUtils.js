/**
 * mathUtils.js
 * Euclidean distance, MSE, and circular difference for angle error.
 */

export const getDistance = (v1, v2) => {
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2 + (v1.z - v2.z) ** 2);
};

export const getVectorMagnitude = (v) => {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
};

export const getAngleDifference = (a1, a2) => {
  let diff = Math.abs(a1 - a2) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
};

export const calculateMSE = (predictions, targets) => {
  if (predictions.length === 0) return 0;
  const sumSquaredError = predictions.reduce((acc, pred, i) => {
    return acc + (pred - targets[i]) ** 2;
  }, 0);
  return sumSquaredError / predictions.length;
};

export const radToDeg = (rad) => (rad * 180) / Math.PI;
export const degToRad = (deg) => (deg * Math.PI) / 180;
