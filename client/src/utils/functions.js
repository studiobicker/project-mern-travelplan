export function getBounds(lngs, lats) {
  console.log(lngs);
  debugger;
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return [
    [minLng, minLat],
    [maxLng, maxLat]
  ];
}
