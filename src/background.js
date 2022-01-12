// @flow
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit();

const pathPrefix = '/package/';
const {
  scope,
  packageName,
} = (() => {
  const split = window.location.pathname.substring(pathPrefix.length).split('/');

  if (split.length > 1) {
    return {
      scope: split[0],
      packageName: split[1],
    }
  }

  return {
    scope: undefined,
    packageName: split[0],
  }
})();

octokit.repos.getContent({
  owner: 'flow-typed',
  repo: 'flow-typed',
  path: `definitions/npm${scope ? `/${scope}` : ''}`,
}).then((res) => {
  const filteredDefinitions = res.data.filter((defs) => defs.name.startsWith(`${packageName}_`));

  if (filteredDefinitions.length > 0) {
    // do something
    console.log(filteredDefinitions);
  }
});
