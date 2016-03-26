const on = require('../../lib/yapml.js');

describe('YAPML', () => {
  describe('matching on a simple value', () => {
    var match;

    beforeEach(() => {
      match = on.value(42, () => 36).match;
    });

    it('matches the exact value', () => {
      expect(match(42)).toBe(36);
    });

    it('throws a non exhaustive error if it cannot match', () => {
      expect(() => match(79)).toThrowError("Non-exhaustive patterns");
    });
  });

  describe('matching anything', () => {
    var match;

    beforeEach(() => {
      match = on.anything(increment).match;
    });

    it('truly matches anything', () => {
      expect(match).not.toThrow();
    });

    it('yields the matches value to the block', () => {
      expect(match(35)).toBe(36);
    });
  });
});

function increment(n) {
  return n + 1;
}
