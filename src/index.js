/**
 * @file Increment the version of a package across the entire codebase
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @copyright Copyright 2020 Todd D. Esposito.
 * @license Released under the MIT license.
 */

const fs = require('fs')

const {Command, flags} = require('@oclif/command')
const bumpVersion = require('./bump-version')
const updateTarget = require('./update-target')
const commitChanges = require('./commit-changes')

class EhVersionerCommand extends Command {
  async run() {
    var updateList = ['package.json']

    const {args, flags} = this.parse(EhVersionerCommand)
    if (!fs.existsSync('./package.json')) {
      this.error('No package.json file in the current directory. Aborting.', {exit: 1})
    }

    var pkg
    try {
      pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    } catch (error) {
      this.error('Your package.json seems to be ill-formed. Aborting.', {exit: 2})
    }
    var current = pkg.version

    if (flags.init) {
      if (pkg.ehVersioner) {
        this.error('There is already an ehVersioner key in your package.json. Aborting.', {exit: 3})
      }
      pkg.ehVersion = {
        "targets": [
          {
            "comment": "target a (possibly nested) key in a JSON file. This comment is instructive, not functional",
            "file": "some-file.json",
            "key": "software.version.key",
          },
          {
            "comment": "target a string in file. This comment is instructive, not functional",
            "file": "site/template/footer.inc.html",
            "search": "<p>Site Version {{version}}</p>",
          },
        ]
      }
    } else {
      if (!current && !flags.force) {
        if (!flags.quiet) {
          this.warn('No "version" key in package.json. Setting version to 1.0.0')
        }
        current = '1.0.0'
        args.reason = 'set'
      }

      var bumped
      try {
        if (flags.force) {
          args.target = flags.force
          args.reason = 'force'
        }
        bumped = bumpVersion(current, args.reason, args.target)
      } catch (error) {
        this.error(error, {exit: 1})
      }

      if (!flags.quiet) {
        if (args.reason === 'set') {
          this.log(`Setting version to ${bumped}`)
        } else {
          this.log(`Bumping version from ${current} to ${bumped}`)
        }
      }
      pkg.version = bumped

      if (pkg.ehVersioner && pkg.ehVersioner.targets && Array.isArray(pkg.ehVersioner.targets)) {
        pkg.ehVersioner.targets.forEach(t => {
          try {
            updateTarget(t, current, bumped, flags)
            updateList.push(t.file)
            if (!flags.quiet) {
              this.log(`Updated ${t.file}`)
            }
          } catch (error) {
            this.warn(error)
          }
        })
      }
    }

    if (!flags['dry-run']) {
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
      if (!flags.init) {
        try {
          commitChanges(updateList, current, bumped, flags)
        } catch (error) {
          this.warn(error)
        }
      }
    }
  }
}

EhVersionerCommand.args = [
  {
    name: 'reason',
    default: 'patch',
    description: 'reason for the version change',
    options: ['release', 'major', 'minor', 'patch', 'alpha', 'beta', 'rc'],
  },
  {
    name: 'target',
    default: 'minor',
    description: 'for alpha/beta/rc, the target to bump (major/minor/patch)',
    options: ['major', 'minor', 'patch'],
  },
]

EhVersionerCommand.flags = {
  commit: flags.boolean({
    default: true,
    allowNo: true,
    description: 'commit changes',
  }),
  'dry-run': flags.boolean({
    char: 'd',
    default: false,
    allowNo: false,
    description: 'don\'t change anything, just describe what would happen',
  }),
  force: flags.string({
    char: 'f',
    description: 'force the version. Overrides arguments',
  }),
  init: flags.boolean({
    default: false,
    allowNo: false,
    description: 'initialize the local package.json with the ehVersioner key',
  }),
  push: flags.boolean({
    default: true,
    allowNo: true,
    description: 'push changes',
  }),
  quiet: flags.boolean({
    char: 'q',
    default: false,
    allowNo: false,
    description: 'don\'t output anything, just get on with it',
  }),
  tag: flags.boolean({
    default: true,
    allowNo: true,
    description: 'tag the commit and push the tag',
  }),
  // oclif-provided flags
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
}

EhVersionerCommand.description = `Updates the project version across the entire codebase
`

module.exports = EhVersionerCommand
