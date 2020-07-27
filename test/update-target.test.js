const fs = require('fs')

const {expect} = require('@oclif/test')
const {fancy} = require('fancy-test') // eslint-disable-line node/no-extraneous-require
const mock = require('mock-fs')

const updateTarget = require('../src/update-target')

describe('updateTarget()', () => {
  // eslint-disable-next-line no-undef
  beforeEach(() => mock({
    'package.json': JSON.stringify({
      name: 'test-bumpversion',
      version: '1.2.3',
    }),
    'some-dir': {
      'has-correct-version.json': JSON.stringify({
        this: 'has the correct version',
        version: '1.2.3',
      }),
      'has-nested-correct-version.json': JSON.stringify({
        this: 'has the correct version',
        nested: {
          version: '1.2.3',
        },
      }),
      'has-wrong-version.json': JSON.stringify({
        this: 'has the wrong version',
        version: '2.3.4',
      }),
      'has-no-version.json': JSON.stringify({
        this: 'has the no version',
      }),
      'some-subdir': {
        'some-file.py': '#! /usr/bin/python\n__version__ = "1.2.3"\n__name__ = "Testing Python Replace"\n',
      },
      'another-subdir': {
        'some-file.js': '// This is a test JS file\n\nconst VERSION = "1.2.3"\n\nconst testme = () => true\n',
      },
    },
  }))

  // eslint-disable-next-line no-undef
  afterEach(() => mock.restore())

  const goodupdate = [
    // update package.json from 1.2.3 to 2.0.0
    // { path: 'package.json', from: '1.2.3', to: '2.0.0' },
    {
      file: 'some-dir/has-correct-version.json',
      reason: 'using a top-level key in a JSON file',
      from: '1.2.3',
      to: '2.0.0',
      key: 'version',
      expected: JSON.stringify({
        this: 'has the correct version',
        version: '2.0.0',
      }),
    },
    {
      file: 'some-dir/has-nested-correct-version.json',
      reason: 'using a nested key in a JSON file',
      from: '1.2.3',
      to: '2.0.0',
      key: 'nested.version',
      expected: JSON.stringify({
        this: 'has the correct version',
        nested: {
          version: '2.0.0',
        },
      }),
    },
    {
      file: 'some-dir/some-subdir/some-file.py',
      reason: 'using a search string in a Python source file',
      from: '1.2.3',
      to: '2.0.0',
      search: '__version__ = "{{version}}"',
      expected: '#! /usr/bin/python\n__version__ = "2.0.0"\n__name__ = "Testing Python Replace"\n',
    },
    {
      file: 'some-dir/another-subdir/some-file.js',
      reason: 'using a search string in a JavaScript source file',
      from: '1.2.3',
      to: '2.0.0',
      search: 'const VERSION = "{{version}}"',
      expected: '// This is a test JS file\n\nconst VERSION = "2.0.0"\n\nconst testme = () => true\n',
    },
  ]

  const badupdate = [
    {
      reason: 'no file specified',
    },
    {
      file: 'dummy-file.json',
      reason: 'no key nor search specified',
    },
    {
      file: 'some-dir/some-subdir/does-not-exist.cpp',
      reason: 'no such file',
      search: '*char version = "{{version}}"',
    },
    {
      file: 'some-dir/some-subdir',
      reason: 'not a regular file',
      search: '*char version = "{{version}}"',
    },
    {
      file: 'some-dir/some-subdir/some-file.py',
      reason: 'search string not found in a source file',
      from: '2.3.4',
      to: '3.0.0',
      search: '__version__ = "{{version}}"',
    },
    {
      file: 'some-dir/some-subdir/some-file.py',
      reason: 'using "key" for a non-JSON file',
      from: '2.3.4',
      to: '3.0.0',
      key: 'version',
    },
    {
      file: 'some-dir/has-nested-correct-version.json',
      reason: 'specifying a non-existant nested key',
      from: '1.2.3',
      to: '2.0.0',
      key: 'invalid.nested.version',
    },
  ]

  goodupdate.forEach(item => {
    fancy
    .do(() => {
      updateTarget(item, item.from, item.to, {})
    })
    .it(`Updates ${item.reason} correctly`, () => {
      expect(fs.readFileSync(item.file, 'utf8')).to.equal(item.expected)
    })
  })
  badupdate.forEach(item => {
    fancy
    .do(() => {
      updateTarget(item, item.from, item.to, {})
    })
    .catch(/.*/)
    .it(`${item.reason} -> Throws an error`)
  })
})
