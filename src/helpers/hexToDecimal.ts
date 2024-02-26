const hexToDecimal = (hex: string) => {
  const hexWithoutHash = hex.replace(/^#/, '');
  return parseInt(hexWithoutHash, 16);
};

export default hexToDecimal;
