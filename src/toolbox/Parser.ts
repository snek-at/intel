const safelyParseJSON = <T, E>(json: any, defaultValue: E) => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return defaultValue;
  }
};

export { safelyParseJSON };
