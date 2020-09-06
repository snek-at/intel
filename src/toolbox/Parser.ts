const safelyParseJSON = <T, E>(json: any, defaultValue: E) => {
  // This function cannot be optimised, it's best to
  // keep it small!

  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return defaultValue;
  }
};

export { safelyParseJSON };
