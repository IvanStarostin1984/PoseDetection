const { add } = require('./add');

test('adds numbers', () => {
  expect(add(1, 2)).toBe(3);
});
