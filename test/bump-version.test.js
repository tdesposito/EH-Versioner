const {expect, test} = require('@oclif/test')
const {fancy} = require('fancy-test') // eslint-disable-line node/no-extraneous-require

const bumpVersion = require('../src/bump-version')

describe('bumpVersion()', () => {
  const goodbump = [
    // We should increment the specified part
    {current: '1.2.3', reason: 'major', expected: '2.0.0'},
    {current: '1.2.3', reason: 'minor', expected: '1.3.0'},
    {current: '1.2.3', reason: 'patch', expected: '1.2.4'},
    // Move into alpha/beta/rc, with corresonding version target
    {current: '1.2.3', reason: 'alpha', target: 'major', expected: '2.0.0-alpha.0'},
    {current: '1.2.3', reason: 'alpha', target: 'minor', expected: '1.3.0-alpha.0'},
    {current: '1.2.3', reason: 'alpha', target: 'patch', expected: '1.2.4-alpha.0'},
    {current: '1.2.3', reason: 'beta', target: 'patch', expected: '1.2.4-beta.0'},
    {current: '1.2.3', reason: 'beta', target: 'minor', expected: '1.3.0-beta.0'},
    {current: '1.2.3', reason: 'beta', target: 'patch', expected: '1.2.4-beta.0'},
    {current: '1.2.3', reason: 'rc', target: 'major', expected: '2.0.0-rc.0'},
    {current: '1.2.3', reason: 'rc', target: 'minor', expected: '1.3.0-rc.0'},
    {current: '1.2.3', reason: 'rc', target: 'patch', expected: '1.2.4-rc.0'},
    // increment alpha/beta/rc (either with the same command or default 'patch')
    {current: '1.2.3-alpha.4', reason: 'alpha', expected: '1.2.3-alpha.5'},
    {current: '1.2.3-alpha.4', reason: 'patch', expected: '1.2.3-alpha.5'},
    {current: '1.2.3-beta.4', reason: 'beta', expected: '1.2.3-beta.5'},
    {current: '1.2.3-beta.4', reason: 'patch', expected: '1.2.3-beta.5'},
    {current: '1.2.3-rc.4', reason: 'rc', expected: '1.2.3-rc.5'},
    {current: '1.2.3-rc.4', reason: 'patch', expected: '1.2.3-rc.5'},
    // increment alpha/beta/rc revision, default params (patch/minor)
    {current: '1.2.3-alpha.4', reason: 'patch', target: 'patch', expected: '1.2.3-alpha.5'},
    {current: '1.2.3-beta.4', reason: 'patch', target: 'patch', expected: '1.2.3-beta.5'},
    {current: '1.2.3-rc.4', reason: 'patch', target: 'patch', expected: '1.2.3-rc.5'},
    // move from alpha to beta/rc
    {current: '1.2.3-alpha.4', reason: 'beta', expected: '1.2.3-beta.0'},
    {current: '1.2.3-alpha.4', reason: 'rc', expected: '1.2.3-rc.0'},
    // move from beta to rc
    {current: '1.2.3-beta.4', reason: 'rc', expected: '1.2.3-rc.0'},
    // move from alpha/beta/rc to release
    {current: '1.2.3-alpha.4', reason: 'release', expected: '1.2.3'},
    {current: '1.2.3-beta.4', reason: 'release', expected: '1.2.3'},
    {current: '1.2.3-rc.4', reason: 'release', expected: '1.2.3'},
    // --force
    {current: '1.2.3-alpha.4', reason: 'force', target: '3.4.5', expected: '3.4.5'},
    // this only happens internally, but for full coverage:
    {current: '1.2.3', reason: 'set', expected: '1.2.3'},
  ]

  const badbump = [
    // ill-formed version
    {current: '1.1-z', reason: 'major'},
    // release NOT on alpha/beta/rc
    {current: '1.2.3', reason: 'release'},
    // beta/rc -> alpha
    {current: '1.2.3-beta.4', reason: 'alpha'},
    {current: '1.2.3-rc.4', reason: 'alpha'},
    // rc -> beta
    {current: '1.2.3-rc.4', reason: 'beta'},
    // move from alpha/beta/rc to major/minor (patch is OK)
    {current: '1.2.3-alpha.4', reason: 'major'},
    {current: '1.2.3-alpha.4', reason: 'minor'},
    {current: '1.2.3-beta.4', reason: 'major'},
    {current: '1.2.3-beta.4', reason: 'minor'},
    {current: '1.2.3-rc.4', reason: 'major'},
    {current: '1.2.3-rc.4', reason: 'minor'},
    // --force with bad argumnet
    {current: '1.2.3-alpha.4', reason: 'force', target: '3.4'},
    {current: '1.2.3-alpha.4', reason: 'force', target: '3.4.5-invalid.0'},
  ]
  goodbump.forEach(item => {
    test
    .it(`${item.current}: eh-versionbump ${item.reason} ${item.target || ''} -> ${item.expected}`, () => {
      expect(bumpVersion(item.current, item.reason, item.target)).to.equal(item.expected)
    })
  })
  badbump.forEach(item => {
    fancy
    .do(() => bumpVersion(item.current, item.reason, item.target))
    .catch(/.*/)
    .it(`${item.current}: eh-versionbump ${item.reason} ${item.target || ''} -> Throws an error`)
  })
})
