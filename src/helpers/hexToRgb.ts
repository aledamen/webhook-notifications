const hexToRgb = (hex: string) => {
  const hexWithoutNumeral = hex.replace(/^#/, '');
  const r = parseInt(hexWithoutNumeral.substring(0, 2), 16);
  const g = parseInt(hexWithoutNumeral.substring(2, 4), 16);
  const b = parseInt(hexWithoutNumeral.substring(4, 6), 16);

  return `${r}${g}${b}`;
};

export default hexToRgb;
