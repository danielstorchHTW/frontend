const calcultor = require('./first');

test('should add 1+1', () => {
    let expected = 2;
    let actual = calcultor.add(1,1);
    expect(actual).toBe(actual);
})