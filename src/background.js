// @flow
const { Octokit } = require('@octokit/rest');

const flowIcon = require('./flow.svg');
const flowTypedIcon = require('./flow-typed.svg');

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
  ref: 'main',
}).then(async (res) => {
  const filteredDefinitions = res.data.filter((defs) => defs.name.startsWith(`${packageName}_`));
  const libName = `${scope ? `${scope}/` : ''}${packageName}`;

  const addIcon = (attributes: { src: string, title: string }) => {
    const element = document.querySelector(`[title="${libName}"]`)?.parentElement;

    if (element instanceof HTMLElement) {
      const flowTypedIcon = document.createElement('img');
      flowTypedIcon.height = 20;
      flowTypedIcon.style.paddingLeft = '1rem';
      Object.keys(attributes).forEach((attr) => {
        // $FlowExpectedError[prop-missing] It thinks it's a number not a union passed in
        flowTypedIcon[attr] = attributes[attr];
      });

      element.appendChild(flowTypedIcon);

      const tsIcon = element.childNodes?.[1];
      if (tsIcon instanceof HTMLElement) {
        tsIcon.style.display = 'flex';
      }
    }
  };

  if (filteredDefinitions.length > 0) {
    // If it's flow typed create the ft icon
    const supportedVersions = filteredDefinitions.map((def) => def.name.substring(`${packageName}_`.length));

    addIcon({
      src: flowTypedIcon,
      title: `This library is flow-typed in versions: \n${supportedVersions.join('\n')}`,
    })
  } else {
    // Else check if the published package ships flow
    let shipsWithFlow = false;

    const checkByDependencies = () => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://registry.npmjs.org/${encodeURIComponent(libName)}/latest`);
      xhr.send();

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          const { dependencies = {}, devDependencies = {} } = response;

          [...Object.keys(dependencies), ...Object.keys(devDependencies)].forEach((dep) => {
            if (['gen-flow-files', 'flow-copy-source'].indexOf(dep) > -1) {
              shipsWithFlow = true;
              resolve();
            }
          });
          resolve();
        }
      };
    });
    await checkByDependencies();

    if (shipsWithFlow) {
      addIcon({
        src: flowIcon,
        title: 'This library should ship with flowtype',
      })
    }
  }
});
