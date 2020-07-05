# eh-bumpversion

Updates the `version` key in the local `package.json` AND wherever else it occurs in the files you specify. Adheres to a subset of [Semantic Versioning](https://semver.org).

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
<!-- [![Version](https://img.shields.io/npm/v/EH-Versioner.svg)](https://npmjs.org/package/EH-Versioner) -->
<!-- [![Downloads/week](https://img.shields.io/npm/dw/EH-Versioner.svg)](https://npmjs.org/package/EH-Versioner) -->
<!-- [![License](https://img.shields.io/npm/l/EH-Versioner.svg)](https://github.com/tdesposito/EH-Versioner/blob/master/package.json) -->

## Why?

I often need the version number in contexts other than (and in addition to)
`package.json`, such as the `README` and maybe the footer of a static HTML file,
for example.

Shout out to [bumpytrack](https://pypi.org/project/bumpytrack/) for inspiration.

## Usage

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
Short Flag | Long Flag | Effect
-- | -- | --
-d | --dry-run      | don't change anything, just describe what would happen
-f | --force=*version*  | force the version. Overrides arguments
-h | --help         | show help
-q | --quiet        | don't output anything, just get on with it
-v | --version      | show version
   | --no-commit    | don't commit changes
   | --no-push      | don't push changes
   | --no-tag       | don't tag the commit and push the tag

## Installation
```console
$ npm install -g EH-Versioner
... lots of stuff happens here ...
$ eh-bumpversion --version
EH-Versioner/1.0.0 win32-x64 node-v12.13.1
```
*Note that the configuration below will keep this section up to date with the current version of this package.* 😃

## Configuration

Configuration lives in `package.json` under the `ehVersioner` key:

```json
{
  "ehVersioner": {
    "targets": [
      {
        "file": "README.md",
        "search": "EH-Versioner/{{version}} win32-x64 node-v12.13.1"
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
version, and when found replaced with the same phrase with the NEW version. If
the search fails, you get a warning.

## To Do

* Add defaults for the command-line flags to the configuration, so you don't have to specify non-default options all the time.
* Set defaults for the command-line arguments to the configuration.
