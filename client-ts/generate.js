const { exec } = require('child_process');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

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
    'node ../generator/exec/index.js --input http://localhost:5000/swagger/v1/swagger.json --output ./src/api --envName cabinizer',
  );
};

runImp();
