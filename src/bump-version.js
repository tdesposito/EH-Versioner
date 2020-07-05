/**
 * @file The actual version-bumping logic
 *
 * Part of the EH-Versioner tool.
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @copyright Copyright 2020 Todd D. Esposito.
 * @license Released under the MIT license.
 */

/** @constant
 *  The ORDERED list of allowed pre-release tags. We only allow moving UP the list.
 */
const progression = ['alpha', 'beta', 'rc']

module.exports = (current, reason, target) => {
  const validVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([alpha|beta|rc]+)\.(0|[1-9]\d*))?$/
  if (!validVersion.test(current)) {
    throw `The version "${current}" isn't in a form I know how to handle.`
  }

  const parts = current.match(validVersion)
  const major = parseInt(parts[1], 10)
  const minor = parseInt(parts[2], 10)
  const patch = parseInt(parts[3], 10)
  const stage = parts[4]
  const rev = parseInt(parts[5], 10)

  switch (reason) {
  case 'force':
    if (validVersion.test(target)) {
      return target
    }
    throw 'The version you specified is invalid.'
  case 'set':
    return current
  case 'release':
    if (!stage) {
      throw '"release" is only valid on a pre-release stage.'
    }
    return `${major}.${minor}.${patch}`
  case 'major':
    if (stage) {
      throw `We're on a pre-release stage. Please use 'release' rather than ${reason}.`
    }
    return `${major + 1}.0.0`
  case 'minor':
    if (stage) {
      throw `We're on a pre-release stage. Please use 'release' rather than ${reason}.`
    }
    return `${major}.${minor + 1}.0`
  case 'patch':
    if (stage) {
      // since patch is the default, we assume we just want a semantic bump here.
      return `${major}.${minor}.${patch}-${stage}.${rev + 1}`
    }
    return `${major}.${minor}.${patch + 1}`
  default:
    if (stage === reason) {
      return `${major}.${minor}.${patch}-${reason}.${rev + 1}`
    }
    if (stage && progression.indexOf(reason) < progression.indexOf(stage)) {
      throw `I don't support going from ${stage} to ${reason}. Sorry.`
    } else if (stage) {
      return `${major}.${minor}.${patch}-${reason}.0`
    }
    switch (target) {
    case 'major':
      return `${major + 1}.0.0-${reason}.0`
    case 'minor':
      return `${major}.${minor + 1}.0-${reason}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}-${reason}.0`
    }
  }
}
