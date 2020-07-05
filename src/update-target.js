/**
 * @file Updates the version string in a file
 *
 * Part of the EH-Versioner tool.
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @copyright Copyright 2020 Todd D. Esposito.
 * @license Released under the MIT license.
 */

const fs = require('fs')

module.exports = (target, current, bumped, flags) => {
  if (!(target.file && target.search)) {
    throw `Skipping invalid target ${JSON.stringify(target)}.`
  }
  if (!fs.existsSync(target.file)) {
    throw `File '${target.file}' not found!`
  }
  if (!fs.statSync(target.file).isFile()) {
    throw `'${target.file}' is not a regular file. Can't update it!`
  }
  const content = fs.readFileSync(target.file, 'utf8')
  const from = target.search.replace('{{version}}', current)
  const to = target.search.replace('{{version}}', bumped)
  const updated = content.replace(from, to)
  if (updated === content) {
    throw `Couldn't find the search string in ${target.file}!`
  }
  if (!flags['dry-run']) {
    fs.writeFileSync(target.file, updated)
  }
}
