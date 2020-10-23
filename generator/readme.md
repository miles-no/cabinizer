## Generate client api

`yarn install`

`yarn build`

### To generate

```
  node ../exec/index.js --envName yourEnvApiName --input ./swagger.json --output ../../applications/yourAppicationName/api


// dont end the envApiName with apiurl, as this will be added by the tool.

Ex: PETREGAPIURL in .env, use petreg as envName
```

## Sample generate.js in petreg web application project

```js
const { exec } = require("child_process");

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

const runImp = async () => {
  await execShellCommand(
    "node ../../../generate/exec/index.js --input ./swagger/swagger.json --output ./api --envName petreg"
  );
  await execShellCommand(
    "node ../../../generate/exec/index.js --input ./swagger/swagger_pcr.json --output ./api --envName pcr"
  );
  await execShellCommand(
    "node ../../../generate/exec/index.js --input ./swagger/swagger_company.json --output ./api --envName company"
  );
};

runImp();
```

## package.json

```json
  "scripts": {
    "generate-services": "node ./generate.js"
  }
```
