import { transform } from 'babel-core';
import { expect } from 'chai';
import { minify } from 'uglify-js';

const uglify = code => minify(code, {
  fromString: true,
  mangle: false
}).code;

const config = {
  plugins: [
    './',
    ['transform-react-jsx', { pragma: 'j' }],
  ]
};

const configWithoutPlugin = {
  plugins: [
    ['transform-react-jsx', { pragma: 'j' }],
  ]
};

describe('jsx-remove-data-test-id', () => {
  it('does not replace data-something-else', () => {
    const code = '<p data-something-else="cake-day">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('does not remove attributes that contain "data-test-id" in part only', () => {
    const code = '<p data-test-id-not="not-test-id">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('removes data-test-id', () => {
    const code = '<p data-test-id="test-id"></p>';
    const expectedCode = '<p></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });
});
