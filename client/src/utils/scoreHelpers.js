// Converts 0-100 score to a colour
export const scoreToColor = (score) => {
  if (score <= 25) return '#E24B4A';       // red — FALSE
  if (score <= 40) return '#EF9F27';       // orange — MISLEADING
  if (score <= 60) return '#888888';       // grey — UNVERIFIED
  if (score <= 80) return '#6DB96D';       // light green — LIKELY TRUE
  return '#3DAD3D';                         // green — TRUE
};

// Converts score to a background colour (lighter version)
export const scoreToBackground = (score) => {
  if (score <= 25) return '#2a1515';
  if (score <= 40) return '#2a1e0f';
  if (score <= 60) return '#1e1e1e';
  if (score <= 80) return '#152a15';
  return '#0f2a0f';
};

// Converts score to a human-readable label
export const scoreToLabel = (score) => {
  if (score <= 25) return 'FALSE';
  if (score <= 40) return 'MISLEADING';
  if (score <= 60) return 'UNVERIFIED';
  if (score <= 80) return 'LIKELY TRUE';
  return 'TRUE';
};