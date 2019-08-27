const fs = require('fs-extra');
const path = require('path');

const getEnviromentCombo = require('./getEnviromentCombo');

const template = data => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Noreferrer test report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    th {
      text-align: left;
      width: 20%;
    }
    th:first-child {
      max-width: 0;
    }
    pre {
      font-weight: normal;
    }
    td {
      text-align: center;
    }
    .passed {
      background: palegreen;
    }
    .failed {
      background: orangered;
      color: white;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <th>Browser and platform</th>
      ${data[0].suites[0].tests.map(({name}) => `<th>${name}</th>`).join(`
      `)}
    </tr>
    ${data.map(({capabilities, suites}) => {
      return `<tr>
        <th>
          <details>
            <summary>${getEnviromentCombo(capabilities)}</summary>
            <pre>${JSON.stringify(capabilities, null, 2)}</pre>
          </details>
        </th>
        ${suites[0].tests.map(({state}) => `<td class="${state}">${state}</td>`).join(`
        `)}
      </tr>`
    }).join(`
    `)}
  </table>
</body>
</html>
`;

(async function generateReport() {
  const dir = path.resolve('./results');
  const files = await fs.readdir(dir);
  const data = await Promise.all(
    files.map(name => fs.readJson(path.join(dir, name)))
  );
  await fs.writeFile('./report.html', template(data));
})();
