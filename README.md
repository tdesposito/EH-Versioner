# eh-bumpversion

Updates (bumps) the `version` key in the local `package.json` AND wherever else it occurs in the files you specify. Adheres to a subset of [Semantic Versioning](https://semver.org).

[![Version](https://img.shields.io/npm/v/eh-bumpversion.svg)](https://npmjs.org/package/eh-bumpversion)
[![License](https://img.shields.io/npm/l/eh-bumpversion.svg)](https://github.com/tdesposito/EH-Versioner/blob/master/package.json)
[![Downloads](https://img.shields.io/npm/dm/eh-bumpversion)](https://npmjs.org/package/eh-bumpversion)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

## Why?

I often need the version number in contexts in addition to `package.json`, such
as `README.md` or (for example) the footer of a static HTML file.

Shout out to [bumpytrack](https://pypi.org/project/bumpytrack/) for the inspiration.

## Usage

We install an alias, `ehbump` for the "official" `eh-bumpversion` command as of version 1.2.0.

Without any parameters, running `eh-bumpversion` will increment the last version component, meaning "patch".

```console
$ eh-bumpversion
Bumping version from 1.2.3 to 1.2.4
```

Unless you're on an -alpha, -beta or -rc version, then the "revision" of that level.

```console
$ eh-bumpversion
Bumping version from 1.2.3-alpha.4 to 1.2.3-alpha.5
```

If you provide one of `major`, `minor`, `patch` as the first argument, it will update that component

```console
$ eh-bumpversion major
Bumping version from 1.2.3 to 2.0.0
```

```console
$ eh-bumpversion minor
Bumping version from 1.2.3 to 1.3.0
```

```console
$ eh-bumpversion patch
Bumping version from 1.2.3 to 1.2.4
```

If you provide `alpha`, `beta` or `rc`, and you're not on one of those already,
it moves you there. You can provide `major`, `minor` (the deault) or `patch` as
the second argument to tell it which component to update.

```console
$ eh-bumpversion alpha major
Bumping version from 1.2.3 to 2.0.0-alpha.0
```

```console
$ eh-bumpversion beta minor
Bumping version from 1.2.3 to 1.3.0-beta.0
```

```console
$ eh-bumpversion rc patch
Bumping version from 1.2.3 to 1.2.4-rc.0
```

You can go from `alpha` to `beta` or `rc`, or from `beta` to `rc`, but not the
other way.

```console
$ eh-bumpversion rc
Bumping version from 1.3.0-beta.5 to 1.3.0-rc.0
```

Finally, if you're in an alpha, beta or rc version, you can move to the "release" version with, you guessed it:

```console
$ eh-bumpversion release
Bumping version from 1.3.0-beta.4 to 1.3.0
```

## Command Line Flags
Long Flag |Short Flag | Effect
-- | -- | --
--dry-run           |-d | don't change anything, just describe what would happen
--force=*version*   |-f | force the version. Overrides arguments
--help              |-h | show help
--quiet             |-q | don't output anything, just get on with it
--version           |-v | show version
--init              |   | init the ehVersioner configuration key in package.json. Just that and nothing more.
--no-commit         |   | don't commit changes
--no-push           |   | don't push changes
--no-tag            |   | don't tag the commit and push the tag

## Installation
```console
$ npm install -g eh-bumpversion
... lots of stuff happens here ...
$ eh-bumpversion --version
eh-bumpversion/1.1.0 win32-x64 node-v12.13.1
```
*Note that the configuration below will keep this section up to date with the current version of this package.* 😃

## Configuration

Configuration lives in `package.json` under the `ehVersioner` key:

```json
{
  "ehVersioner": {
    "targets": [
      {
        "comment": "target a (possibly nested) key in a JSON file. This line is instructive, not functional",
        "file": "some-file.json",
        "key": "software.version.key"
      },
      {
        "comment": "target a string in file. This line is instructive, not functional",
        "file": "README.md",
        "search": "eh-bumpversion/{{version}} win32-x64 node-v12.13.1"
      },
      {
        "file": "site/template/footer.inc.html",
        "search": "<p>Site Version {{version}}</p>"
      }
    ]
  }
}
```
Each file is searched for the corresponding `search` phrase with the current
version, **OR** for JSON files the indicated `key`. When found the search text
or key is replaced with the NEW version. If the search fails, you get a warning.

## (Maybe) To Do

These are things I think would be good for a general-purpose tool, but which I don't particularly need.

* Add defaults for the command-line flags to the configuration, so you don't have to specify non-default options all the time.
* Set defaults for the command-line arguments to the configuration (if you don't want "patch" for example).
* Make the git phase respect --quiet.
* Add a --verbose mode
