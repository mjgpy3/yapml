# yapml
Yet another pattern matching library.

## Examples

### Dead-horse factorial

```
const on = require('yapml');

const factorial =
  on.value(1, () => 1).
  on.anything((n) => n * factorial(n - 1)).
  match;

console.log(factorial(5)); // => 120
```

### Absolute value

```
const on = require('yapml');

const isNegative = (n) => n < 0;

const abs =
  on.satisfies(isNegative, (v) => -v).
  on.anything((n) => n).
  match;

console.log(abs(-42)); // => 42
console.log(abs(42)); // => 42
```

## Why yet another?
yapml has a slightly different philosophy than those other pattern matching libraries.
It strives to emphasize

 - [fluent syntax](https://en.wikipedia.org/wiki/Fluent_interface)
 - [pointfree](https://en.wikipedia.org/wiki/Tacit_programming) style
