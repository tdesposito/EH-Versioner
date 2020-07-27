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
  if (!(target.file && (target.search || target.key))) {
    throw `Skipping invalid target ${JSON.stringify(target)}.`
  }
  if (!fs.existsSync(target.file)) {
    throw `File '${target.file}' not found!`
  }
  if (!fs.statSync(target.file).isFile()) {
    throw `'${target.file}' is not a regular file. Can't update it!`
  }
  const content = fs.readFileSync(target.file, 'utf8')
  var updated
  if (target.search) {
    const from = target.search.replace('{{version}}', current)
    const to = target.search.replace('{{version}}', bumped)
    updated = content.replace(from, to)
    if (updated === content) {
      throw `Couldn't find the search string in ${target.file}!`
    }
  } else {
    var jsoncontent
    try {
      jsoncontent = JSON.parse(content)
    } catch (error) {
      throw `${target.file} does not appear to be a valid JSON file.`
    }
    var node = jsoncontent
    const keys = target.key.split('.')
    keys.slice(0, -1).forEach(key => {
      if (node[key] === undefined) {
        throw `${target.file} does not have the specified key: ${target.key}.`
      }
      node = node[key]
    })
    if (node[keys.slice(-1)] === current) {
      node[keys.slice(-1)] = bumped
      updated = JSON.stringify(jsoncontent)
    }
  }
  if (!flags['dry-run']) {
    fs.writeFileSync(target.file, updated)
  }
}
