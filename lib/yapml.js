const buildMatcher = (cases) => (actual) => {
  const foundMatcher = cases.find((cse) => cse.matches(actual));

  if (!foundMatcher) {
    throw new Error('Non-exhaustive patterns');
  }

  return foundMatcher.result(actual);
}

function argsAsArray(fn) {
  return function () {
    return fn(Array.from(arguments));
  };
}

const buildNextOn = (previousCases) => {
  var build = (matchesPred, result) => {
    const cases = previousCases.concat(
      [
        {
          matches: matchesPred,
          result: result
        }
      ]
    );

    return {
      match: buildMatcher(cases),
      matchArgs: argsAsArray(buildMatcher(cases)),
      on: buildNextOn(cases)
    };
  };

  return {
    value: (v, result) => build(
      // TODO: This is probably bad
      (actual) => JSON.stringify(actual) === JSON.stringify(v),
      result
    ),
    exactly: (v, result) => build(
      (actual) => actual === v,
      result
    ),
    satisfies: build,
    anything: (result) => build(
      (_) => true,
      result
    ),
    object: {
      withProperties: (properties, result) => build(
        (value) => properties.every((prop) => prop in value),
        result
      )
    }
  };
};

module.exports = buildNextOn([]);
