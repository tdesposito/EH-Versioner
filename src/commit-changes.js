/**
 * @file Commit changes to Git
 *
 * Part of the EH-Versioner tool.
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @copyright Copyright 2020 Todd D. Esposito.
 * @license Released under the MIT license.
 */

const {execSync} = require('child_process')

const git = cmd => {
  try {
    execSync(`git ${cmd}`, {stdio: 'inherit'})
    return true
  } catch (error) {
    // we have a problem; we'll rely on console output for the user to figure it out.
    return false
  }
}

module.exports = (changeList, current, bumped, flags) => {
  const filelist = changeList.join(' ')
  var msg = `Bump version ${current} → ${bumped}`
  if (current === bumped || flags.force) {
    msg = `Set version to ${bumped}`
  }
  // eslint-disable-next-line no-unused-expressions
  flags.commit &&
    git(`add ${filelist}`) &&
    git(`commit -m "${msg}"`) &&
    flags.push &&
    git('push') &&
    flags.tag &&
    git(`tag "v${bumped}"`) &&
    git('push --tags')
}
