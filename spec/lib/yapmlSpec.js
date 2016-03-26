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

  describe('matching an array', () => {
    var match;

    beforeEach(() => {
      match = on.value([1, 2, [3], { foo: 4 }], () => 42).match;
    });

    describe('given an array with the same values', () => {
      it('matches the array', () => {
        expect(match([1, 2, [3], { foo: 4 }])).toBe(42);
      });
    });

    describe('given string that looks like that array, stringified', () => {
      it('does not match', () => {
        expect(() => match(JSON.stringify([1, 2, [3], { foo: 4 }]))).toThrowError('Non-exhaustive patterns');
      });
    });
  });

  describe('matching an object', () => {
    var match;

    beforeEach(() => {
      match = on.value({ foo: "bar", spaz: 99 }, () => 42).match;
    });

    describe('given an object that looks the same', () => {
      it('matches the object', () => {
        expect(match({ foo: "bar", spaz: 99 })).toBe(42);
      });
    });
  });

  describe('matching a value then anything', () => {
    var match;

    beforeEach(() => {
      match = on.value(42, () => 77).
              on.anything(increment).
              match;
    });

    describe('given the value', () => {
      it('matches that value', () => {
        expect(match(42)).toBe(77);
      });
    });

    describe('given some other value', () => {
      it('matches that other value', () => {
        expect(match(35)).toBe(36);
      });
    });
  });

  describe('matching anything then a value', () => {
    var match;

    beforeEach(() => {
      match = on.anything(increment).
              on.value(42, () => 77).
              match;
    });

    describe('given the value', () => {
      it('hits the anything result first', () => {
        expect(match(42)).toBe(43);
      });
    });

    describe('given some other value', () => {
      it('matches that other value', () => {
        expect(match(35)).toBe(36);
      });
    });
  });

  describe('matching exactly some object', () => {
    var match,
      obj = { foo: 'bar' };

    beforeEach(() => {
      match = on.exactly(obj, () => 42).
              on.anything(() => 'other').
              match;
    });

    describe('given the same reference', () => {
      it('matches', () => {
        expect(match(obj)).toBe(42);
      });
    });

    describe('given something else', () => {
      it('doesn\'t match', () => {
        expect(match('foo bar')).toBe('other');
      });
    });

    describe('given an object that looks the same', () => {
      it('doesn\'t match', () => {
        expect(match({ foo: 'bar' })).toBe('other');
      });
    });
  });
});

function increment(n) {
  return n + 1;
}
