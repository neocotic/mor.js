# Contributing

If you have any questions about [mor.js][0] please feel free to [raise an issue][2].

Please [search existing issues][1] for the same feature and/or issue before raising a new issue. Commenting on an
existing issue is usually preferred over raising duplicate issues.

Ensure that you update any relevant unit tests (in the `test` directory) and that all tests are currently passing. This
can be done easily via command-line:

``` bash
# install/update package dependencies
$ npm install
# run test suite
$ grunt test
```

You will obviously need to have [node.js][3] for this, but you should also need to install (if you haven't done so
already) the [Grunt][4] command-line tool:

``` bash
$ npm install -g grunt-cli
```

Use the same coding style as the rest of the [code base][0].

When submitting a pull request, please do *not* build the documentation or the minified files. We will built the
distributables when cutting a release.

All pull requests should be made to the `develop` branch.

Don't forget to add your details to the list of [AUTHORS.md][5] if you want your contribution to be recognized by
others.

[0]: https://github.com/neocotic/mor.js
[1]: https://github.com/neocotic/mor.js/issues
[2]: https://github.com/neocotic/mor.js/issues/new
[3]: http://nodejs.org
[4]: http://gruntjs.com
[5]: https://github.com/neocotic/mor.js/blob/master/AUTHORS.md
