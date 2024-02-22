import { RE_KEBAB } from './constants';

const camelCaseFormat = (name: string) => {
  const hyphenToUpper = (_match: any, _p1: any, p2: string) => p2.toUpperCase();
  return name.replace(RE_KEBAB, hyphenToUpper);
};

export default camelCaseFormat;
