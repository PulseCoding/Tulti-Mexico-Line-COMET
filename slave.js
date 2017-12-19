var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE COMET SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex_tulti_Line_COMET.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
