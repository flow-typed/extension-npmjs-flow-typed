// @flow
const { Octokit } = require('@octokit/rest');

const flowIcon = require('./flow.svg');

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
    const element = document.querySelector(`[title="${scope ? `${scope}/` : ''}${packageName}"]`)?.parentElement;

    if (element instanceof HTMLElement) {
      const flowTypedIcon = document.createElement('img');
      flowTypedIcon.src = flowIcon;
      flowTypedIcon.height = 20;
      flowTypedIcon.style.paddingLeft = '1rem';
      flowTypedIcon.title = 'This is a test';
      element.appendChild(flowTypedIcon);
    }
  }
});
