export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getDifficulty(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  return {
    gap: clamp(210 - safeScore * 2.5, 142, 210),
    distance: clamp(510 - safeScore * 4, 360, 510),
    speed: clamp(190 + safeScore * 3, 190, 285),
  };
}

export function getMedal(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  if (safeScore >= 30) return { name: 'GOLD', color: 0xffd166 };
  if (safeScore >= 15) return { name: 'SILVER', color: 0xcbd5e1 };
  if (safeScore >= 5) return { name: 'BRONZE', color: 0xcd7f55 };
  return null;
}
