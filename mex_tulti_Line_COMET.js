var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
  var Fillerct = null,
      Fillerresults = null,
      CntInFiller = null,
      CntOutFiller = null,
      Filleractual = 0,
      Fillertime = 0,
      Fillersec = 0,
      FillerflagStopped = false,
      Fillerstate = 0,
      Fillerspeed = 0,
      FillerspeedTemp = 0,
      FillerflagPrint = 0,
      FillersecStop = 0,
      FillerdeltaRejected = null,
      FillerONS = false,
      FillertimeStop = 60, //NOTE: Timestop
      FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      FillerflagRunning = false,
      FillerRejectFlag = false,
      FillerReject,
      FillerVerify = (function(){
        try{
          FillerReject = fs.readFileSync('FillerRejected.json')
          if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
            FillerReject = JSON.parse(FillerReject)
          }else{
            throw 12121212
          }
        }catch(err){
          if(err.code == 'ENOENT' || err == 12121212){
            fs.writeFileSync('FillerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
            FillerReject = {
              rejected : 0
            }
          }
        }
      })()
  var Coderct = null,
      Coderresults = null,
      CntInCoder = null,
      CntOutCoder = null,
      Coderactual = 0,
      Codertime = 0,
      Codersec = 0,
      CoderflagStopped = false,
      Coderstate = 0,
      Coderspeed = 0,
      CoderspeedTemp = 0,
      CoderflagPrint = 0,
      CodersecStop = 0,
      CoderONS = false,
      CoderdeltaRejected = null,
      CodertimeStop = 60, //NOTE: Timestop en segundos
      CoderWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      CoderflagRunning = false,
      CoderRejectFlag = false,
      CoderReject,
      CoderVerify = (function(){
            try{
              CoderReject = fs.readFileSync('CoderRejected.json')
              if(CoderReject.toString().indexOf('}') > 0 && CoderReject.toString().indexOf('{\"rejected\":') != -1){
                CoderReject = JSON.parse(CoderReject)
              }else{
                throw 12121212
              }
            }catch(err){
              if(err.code == 'ENOENT' || err == 12121212){
                fs.writeFileSync('CoderRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
                CoderReject = {
                  rejected : 0
                }
              }
            }
          })();
      var Xrayct = null,
          Xrayresults = null,
          CntInXray = null,
          CntOutXray = null,
          Xrayactual = 0,
          Xraytime = 0,
          Xraysec = 0,
          XrayflagStopped = false,
          Xraystate = 0,
          Xrayspeed = 0,
          XrayspeedTemp = 0,
          XrayflagPrint = 0,
          XraysecStop = 0,
          XraydeltaRejected = null,
          XrayONS = false,
          XraytimeStop = 60, //NOTE: Timestop
          XrayWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
          XrayflagRunning = false,
          XrayRejectFlag = false,
          XrayReject,
          XrayVerify = (function(){
            try{
              XrayReject = fs.readFileSync('XrayRejected.json')
              if(XrayReject.toString().indexOf('}') > 0 && XrayReject.toString().indexOf('{\"rejected\":') != -1){
                XrayReject = JSON.parse(XrayReject)
              }else{
                throw 12121212
              }
            }catch(err){
              if(err.code == 'ENOENT' || err == 12121212){
                fs.writeFileSync('XrayRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
                XrayReject = {
                  rejected : 0
                }
              }
            }
          })();
  var Tunnelct = null,
      Tunnelresults = null,
      CntInTunnel = null,
      CntOutTunnel = null,
      Tunnelactual = 0,
      Tunneltime = 0,
      Tunnelsec = 0,
      TunnelflagStopped = false,
      Tunnelstate = 0,
      Tunnelspeed = 0,
      TunnelspeedTemp = 0,
      TunnelflagPrint = 0,
      TunnelsecStop = 0,
      TunnelONS = false,
      TunneldeltaRejected = null,
      TunneltimeStop = 60, //NOTE: Timestop en segundos
      TunnelWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      TunnelflagRunning = false,
      TunnelRejectFlag = false,
      TunnelReject,
      TunnelVerify = (function(){
          try{
            TunnelReject = fs.readFileSync('TunnelRejected.json')
            if(TunnelReject.toString().indexOf('}') > 0 && TunnelReject.toString().indexOf('{\"rejected\":') != -1){
              TunnelReject = JSON.parse(TunnelReject)
            }else{
              throw 12121212
            }
          }catch(err){
            if(err.code == 'ENOENT' || err == 12121212){
              fs.writeFileSync('TunnelRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
              TunnelReject = {
                rejected : 0
              }
            }
          }
        })();
  var Wrapperct = null,
      Wrapperresults = null,
      CntInWrapper = null,
      CntOutWrapper = null,
      Wrapperactual = 0,
      Wrappertime = 0,
      Wrappersec = 0,
      WrapperflagStopped = false,
      Wrapperstate = 0,
      Wrapperspeed = 0,
      WrapperspeedTemp = 0,
      WrapperflagPrint = 0,
      WrappersecStop = 0,
      WrapperONS = false,
      WrapperdeltaRejected = null,
      WrappertimeStop = 60, //NOTE: Timestop en segundos
      WrapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      WrapperflagRunning = false,
      CntBoxInWrapper = null,
      WrapperRejectFlag = false,
      WrapperReject,
      WrapperVerify = (function(){
          try{
            WrapperReject = fs.readFileSync('WrapperRejected.json')
            if(WrapperReject.toString().indexOf('}') > 0 && WrapperReject.toString().indexOf('{\"rejected\":') != -1){
              WrapperReject = JSON.parse(WrapperReject)
            }else{
              throw 12121212
            }
          }catch(err){
            if(err.code == 'ENOENT' || err == 12121212){
              fs.writeFileSync('WrapperRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
              WrapperReject = {
                rejected : 0
              }
            }
          }
        })();
  var Inverterct = null,
      Inverterresults = null,
      CntInInverter = null,
      CntOutInverter = null,
      Inverteractual = 0,
      Invertertime = 0,
      Invertersec = 0,
      InverterflagStopped = false,
      Inverterstate = 0,
      Inverterspeed = 0,
      InverterspeedTemp = 0,
      InverterflagPrint = 0,
      InvertersecStop = 0,
      InverterONS = false,
      InverterdeltaRejected = null,
      InvertertimeStop = 60, //NOTE: Timestop en segundos
      InverterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      InverterflagRunning = false,
      InverterRejectFlag = false,
      InverterReject,
      InverterVerify = (function(){
          try{
            InverterReject = fs.readFileSync('InverterRejected.json')
            if(InverterReject.toString().indexOf('}') > 0 && InverterReject.toString().indexOf('{\"rejected\":') != -1){
              InverterReject = JSON.parse(InverterReject)
            }else{
              throw 12121212
            }
          }catch(err){
            if(err.code == 'ENOENT' || err == 12121212){
              fs.writeFileSync('InverterRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
              InverterReject = {
                rejected : 0
              }
            }
          }
        })();
  var CntOutEOL=null,
      secEOL=0;
  var publishConfig;
      var intId1,intId2,intId3;
      var files = fs.readdirSync("C:/PULSE/COMET_LOGS/"); //Leer documentos
      var actualdate = Date.now(); //Fecha actual
      var text2send=[];//Vector a enviar
      var flagInfo2Send=0;
      var i=0;
      var pubnub = new PubNub({
        publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
      subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
        uuid: "MEX_TUL_COMET"
      });


      var senderData = function (){
        pubnub.publish(publishConfig, function(status, response) {
      });};

      var client1 = modbus.client.tcp.complete({
        'host': "192.168.10.102",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client2 = modbus.client.tcp.complete({
        'host': "192.168.10.103",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client3 = modbus.client.tcp.complete({
        'host': "192.168.10.104",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
  client3.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}
try{
  /*----------------------------------------------------------------------------------function-------------------------------------------------------------------------------------------*/
  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/COMET_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (3*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          publishConfig = {
            channel : "MEX_TUL_Monitor",
            message : {
                  line: "COMET",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
//PubNub --------------------------------------------------------------------------------------------------------------------
client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          //CntInFiller =  joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[4], resp.register[5]);
          CntInFiller = joinWord(resp.register[0], resp.register[1])*3; //Physic Signal
          CntOutFiller = joinWord(resp.register[6], resp.register[7]);  //Physic Signal
          CntInCoder  = joinWord(resp.register[8], resp.register[9]);   //Physic Signal
          CntOutCoder = joinWord(resp.register[8], resp.register[9]);   
          CntInXray = joinWord(resp.register[8], resp.register[9]);    
          CntOutXray = joinWord(resp.register[10], resp.register[11]);   //Physic Signal
          CntInTunnel = joinWord(resp.register[10], resp.register[11]);
          //------------------------------------------Filler----------------------------------------------
                Fillerct = CntOutFiller // NOTE: igualar al contador de salida
                if (!FillerONS && Fillerct) {
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  FillerONS = true
                  Fillertime = Date.now()
                }
                if(Fillerct > Filleractual){
                  if(FillerflagStopped){
                    Fillerspeed = Fillerct - FillerspeedTemp
                    FillerspeedTemp = Fillerct
                    Fillersec = Date.now()
                    FillerdeltaRejected = null
                    FillerRejectFlag = false
                    Fillertime = Date.now()
                  }
                  FillersecStop = 0
                  Fillerstate = 1
                  FillerflagStopped = false
                  FillerflagRunning = true
                } else if( Fillerct == Filleractual ){
                  if(FillersecStop == 0){
                    Fillertime = Date.now()
                    FillersecStop = Date.now()
                  }
                  if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                    Fillerspeed = 0
                    Fillerstate = 2
                    FillerspeedTemp = Fillerct
                    FillerflagStopped = true
                    FillerflagRunning = false
                    FillerflagPrint = 1
                  }
                }
                Filleractual = Fillerct
                if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                  if(FillerflagRunning && Fillerct){
                    FillerflagPrint = 1
                    FillersecStop = 0
                    Fillerspeed = Fillerct - FillerspeedTemp
                    FillerspeedTemp = Fillerct
                    Fillersec = Date.now()
                  }
                }
                Fillerresults = {
                  ST: Fillerstate,
                  CPQI : CntInFiller,
                  CPQO : CntOutFiller,
                  //CPQR : FillerdeltaRejected,
                  SP: Fillerspeed
                }
                if (FillerflagPrint == 1) {
                  for (var key in Fillerresults) {
                    if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Filler_comet.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                  }
                  FillerflagPrint = 0
                  FillersecStop = 0
                  Fillertime = Date.now()
                }
          //------------------------------------------Filler----------------------------------------------
          //------------------------------------------Coder----------------------------------------------
                Coderct = CntOutCoder //NOTE: igualar al contador de salida
                if (!CoderONS && Coderct) {
                  CoderspeedTemp = Coderct
                  Codersec = Date.now()
                  CoderONS = true
                  Codertime = Date.now()
                }
                if(Coderct > Coderactual){
                  if(CoderflagStopped){
                    Coderspeed = Coderct - CoderspeedTemp
                    CoderspeedTemp = Coderct
                    Codersec = Date.now()
                    CoderdeltaRejected = null
                    CoderRejectFlag = false
                    Codertime = Date.now()
                  }
                  CodersecStop = 0
                  Coderstate = 1
                  CoderflagStopped = false
                  CoderflagRunning = true
                } else if( Coderct == Coderactual ){
                  if(CodersecStop == 0){
                    Codertime = Date.now()
                    CodersecStop = Date.now()
                  }
                  if( ( Date.now() - ( CodertimeStop * 1000 ) ) >= CodersecStop ){
                    //Coderspeed = 0
                    Coderstate = 2
                    CoderspeedTemp = Coderct
                    CoderflagStopped = true
                    CoderflagRunning = false
                    CoderflagPrint = 1
                  }
                }
                Coderactual = Coderct
                if(Date.now() - 60000 * CoderWorktime >= Codersec && CodersecStop == 0){
                  if(CoderflagRunning && Coderct){
                    CoderflagPrint = 1
                    CodersecStop = 0
                    Coderspeed = Coderct - CoderspeedTemp
                    CoderspeedTemp = Coderct
                    Codersec = Date.now()
                  }
                }
                Coderresults = {
                  ST: Coderstate,
                  CPQI: CntInCoder,
                  CPQO: CntOutCoder,
                  //CPQR : CoderdeltaRejected,
                  SP: Coderspeed
                }
                if (CoderflagPrint == 1) {
                  for (var key in Coderresults) {
                    if( Coderresults[key] != null && ! isNaN(Coderresults[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Coder_comet.log', 'tt=' + Codertime + ',var=' + key + ',val=' + Coderresults[key] + '\n')
                  }
                  CoderflagPrint = 0
                  CodersecStop = 0
                  Codertime = Date.now()
                }
          //------------------------------------------Coder----------------------------------------------
          //------------------------------------------Xray----------------------------------------------
                Xrayct = CntOutXray // NOTE: igualar al contador de salida
                if (!XrayONS && Xrayct) {
                  XrayspeedTemp = Xrayct
                  Xraysec = Date.now()
                  XrayONS = true
                  Xraytime = Date.now()
                }
                if(Xrayct > Xrayactual){
                  if(XrayflagStopped){
                    Xrayspeed = Xrayct - XrayspeedTemp
                    XrayspeedTemp = Xrayct
                    Xraysec = Date.now()
                    XraydeltaRejected = null
                    XrayRejectFlag = false
                    Xraytime = Date.now()
                  }
                  XraysecStop = 0
                  Xraystate = 1
                  XrayflagStopped = false
                  XrayflagRunning = true
                } else if( Xrayct == Xrayactual ){
                  if(XraysecStop == 0){
                    Xraytime = Date.now()
                    XraysecStop = Date.now()
                  }
                  if( ( Date.now() - ( XraytimeStop * 1000 ) ) >= XraysecStop ){
                    //Xrayspeed = 0
                    Xraystate = 2
                    XrayspeedTemp = Xrayct
                    XrayflagStopped = true
                    XrayflagRunning = false
                    XrayflagPrint = 1
                  }
                }
                Xrayactual = Xrayct
                if(Date.now() - 60000 * XrayWorktime >= Xraysec && XraysecStop == 0){
                  if(XrayflagRunning && Xrayct){
                    XrayflagPrint = 1
                    XraysecStop = 0
                    Xrayspeed = Xrayct - XrayspeedTemp
                    XrayspeedTemp = Xrayct
                    Xraysec = Date.now()
                  }
                }
                Xrayresults = {
                  ST: Xraystate,
                  CPQI : CntInXray,
                  CPQO : CntOutXray,
                  //CPQR : XraydeltaRejected,
                  SP: Xrayspeed
                }
                if (XrayflagPrint == 1) {
                  for (var key in Xrayresults) {
                    if( Xrayresults[key] != null && ! isNaN(Xrayresults[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Xray_comet.log', 'tt=' + Xraytime + ',var=' + key + ',val=' + Xrayresults[key] + '\n')
                  }
                  XrayflagPrint = 0
                  XraysecStop = 0
                  Xraytime = Date.now()
                }
          //------------------------------------------Xray----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
    clearInterval(intId1);
  });
  client2.on('connect', function(err) {
    intId2 =
      setInterval(function(){
          client2.readHoldingRegisters(0, 16).then(function(resp) {
            CntOutTunnel =  joinWord(resp.register[0], resp.register[1]) //Physic Signal
            //------------------------------------------Tunnel----------------------------------------------
                  Tunnelct = CntOutTunnel // NOTE: igualar al contador de salida
                  if (!TunnelONS && Tunnelct) {
                    TunnelspeedTemp = Tunnelct
                    Tunnelsec = Date.now()
                    TunnelONS = true
                    Tunneltime = Date.now()
                  }
                  if(Tunnelct > Tunnelactual){
                    if(TunnelflagStopped){
                      Tunnelspeed = Tunnelct - TunnelspeedTemp
                      TunnelspeedTemp = Tunnelct
                      Tunnelsec = Date.now()
                      TunneldeltaRejected = null
                      TunnelRejectFlag = false
                      Tunneltime = Date.now()
                    }
                    TunnelsecStop = 0
                    Tunnelstate = 1
                    TunnelflagStopped = false
                    TunnelflagRunning = true
                  } else if( Tunnelct == Tunnelactual ){
                    if(TunnelsecStop == 0){
                      Tunneltime = Date.now()
                      TunnelsecStop = Date.now()
                    }
                    if( ( Date.now() - ( TunneltimeStop * 1000 ) ) >= TunnelsecStop ){
                      //Tunnelspeed = 0
                      Tunnelstate = 2
                      TunnelspeedTemp = Tunnelct
                      TunnelflagStopped = true
                      TunnelflagRunning = false
                      TunnelflagPrint = 1
                    }
                  }
                  Tunnelactual = Tunnelct
                  if(Date.now() - 60000 * TunnelWorktime >= Tunnelsec && TunnelsecStop == 0){
                    if(TunnelflagRunning && Tunnelct){
                      TunnelflagPrint = 1
                      TunnelsecStop = 0
                      Tunnelspeed = Tunnelct - TunnelspeedTemp
                      TunnelspeedTemp = Tunnelct
                      Tunnelsec = Date.now()
                    }
                  }
                  Tunnelresults = {
                    ST: Tunnelstate,
                    CPQI: CntOutXray,//CntInTunnel,
                    CPQO: CntOutTunnel,
                    //CPQR : TunneldeltaRejected,
                    SP: Tunnelspeed
                  }
                  if (TunnelflagPrint == 1) {
                    for (var key in Tunnelresults) {
                      if( Tunnelresults[key] != null && ! isNaN(Tunnelresults[key]) )
                      //NOTE: Cambiar path
                      fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Tunnel_comet.log', 'tt=' + Tunneltime + ',var=' + key + ',val=' + Tunnelresults[key] + '\n')
                    }
                    TunnelflagPrint = 0
                    TunnelsecStop = 0
                    Tunneltime = Date.now()
                  }
            //------------------------------------------Tunnel----------------------------------------------

          });//Cierre de lectura
        },1000);
    });//Cierre de cliente

    client2.on('error', function(err){
      clearInterval(intId2);
    });
    client2.on('close', function() {
      clearInterval(intId2);
    });
    client3.on('connect', function(err) {
      intId3 =
        setInterval(function(){
            client3.readHoldingRegisters(0, 16).then(function(resp) {
              CntInWrapper =  joinWord(resp.register[0], resp.register[1]) //Physic Signal
              CntBoxInWrapper = joinWord(resp.register[4], resp.register[5]) //Physic Signal
              CntInInverter = joinWord(resp.register[2], resp.register[3])    //Physic Signal
              CntOutInverter = joinWord(resp.register[0], resp.register[1])
              CntOutWrapper = joinWord(resp.register[6], resp.register[7])
              CntOutEOL = joinWord(resp.register[6], resp.register[7])        //Physic Signal
              //------------------------------------------Wrapper----------------------------------------------
                    Wrapperct = CntOutWrapper // NOTE: igualar al contador de salida
                    if (!WrapperONS && Wrapperct) {
                      WrapperspeedTemp = Wrapperct
                      Wrappersec = Date.now()
                      WrapperONS = true
                      Wrappertime = Date.now()
                    }
                    if(Wrapperct > Wrapperactual){
                      if(WrapperflagStopped){
                        Wrapperspeed = Wrapperct - WrapperspeedTemp
                        WrapperspeedTemp = Wrapperct
                        Wrappersec = Date.now()
                        WrapperdeltaRejected = null
                        WrapperRejectFlag = false
                        Wrappertime = Date.now()
                      }
                      WrappersecStop = 0
                      Wrapperstate = 1
                      WrapperflagStopped = false
                      WrapperflagRunning = true
                    } else if( Wrapperct == Wrapperactual ){
                      if(WrappersecStop == 0){
                        Wrappertime = Date.now()
                        WrappersecStop = Date.now()
                      }
                      if( ( Date.now() - ( WrappertimeStop * 1000 ) ) >= WrappersecStop ){
                        //Wrapperspeed = 0
                        Wrapperstate = 2
                        WrapperspeedTemp = Wrapperct
                        WrapperflagStopped = true
                        WrapperflagRunning = false
                        WrapperflagPrint = 1
                      }
                    }
                    Wrapperactual = Wrapperct
                    if(Date.now() - 60000 * WrapperWorktime >= Wrappersec && WrappersecStop == 0){
                      if(WrapperflagRunning && Wrapperct){
                        WrapperflagPrint = 1
                        WrappersecStop = 0
                        Wrapperspeed = Wrapperct - WrapperspeedTemp
                        WrapperspeedTemp = Wrapperct
                        Wrappersec = Date.now()
                      }
                    }
                    Wrapperresults = {
                      ST: Wrapperstate,
                      CPQBI: CntInWrapper,
                      CPQCI: CntBoxInWrapper,
                      CPQO: CntOutWrapper,
                      //CPQR : WrapperdeltaRejected,
                      SP: Wrapperspeed
                    }
                    if (WrapperflagPrint == 1) {
                      for (var key in Wrapperresults) {
                        if( Wrapperresults[key] != null && ! isNaN(Wrapperresults[key]) )
                        //NOTE: Cambiar path
                        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Wrapper_comet.log', 'tt=' + Wrappertime + ',var=' + key + ',val=' + Wrapperresults[key] + '\n')
                      }
                      WrapperflagPrint = 0
                      WrappersecStop = 0
                      Wrappertime = Date.now()
                    }
              //------------------------------------------Wrapper----------------------------------------------
              //------------------------------------------Inverter----------------------------------------------
                    Inverterct = CntOutInverter // NOTE: igualar al contador de salida
                    if (!InverterONS && Inverterct) {
                      InverterspeedTemp = Inverterct
                      Invertersec = Date.now()
                      InverterONS = true
                      Invertertime = Date.now()
                    }
                    if(Inverterct > Inverteractual){
                      if(InverterflagStopped){
                        Inverterspeed = Inverterct - InverterspeedTemp
                        InverterspeedTemp = Inverterct
                        Invertersec = Date.now()
                        InverterdeltaRejected = null
                        InverterRejectFlag = false
                        Invertertime = Date.now()
                      }
                      InvertersecStop = 0
                      Inverterstate = 1
                      InverterflagStopped = false
                      InverterflagRunning = true
                    } else if( Inverterct == Inverteractual ){
                      if(InvertersecStop == 0){
                        Invertertime = Date.now()
                        InvertersecStop = Date.now()
                      }
                      if( ( Date.now() - ( InvertertimeStop * 1000 ) ) >= InvertersecStop ){
                        //Inverterspeed = 0
                        Inverterstate = 2
                        InverterspeedTemp = Inverterct
                        InverterflagStopped = true
                        InverterflagRunning = false
                        InverterflagPrint = 1
                      }
                    }
                    Inverteractual = Inverterct
                    if(Date.now() - 60000 * InverterWorktime >= Invertersec && InvertersecStop == 0){
                      if(InverterflagRunning && Inverterct){
                        InverterflagPrint = 1
                        InvertersecStop = 0
                        Inverterspeed = Inverterct - InverterspeedTemp
                        InverterspeedTemp = Inverterct
                        Invertersec = Date.now()
                      }
                    }
                    Inverterresults = {
                      ST: Inverterstate,
                      CPQI: CntInInverter,
                      CPQO: CntOutInverter,
                      //CPQR : InverterdeltaRejected,
                      SP: Inverterspeed
                    }
                    if (InverterflagPrint == 1) {
                      for (var key in Inverterresults) {
                        if( Inverterresults[key] != null && ! isNaN(Inverterresults[key]) )
                        //NOTE: Cambiar path
                        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Inverter_comet.log', 'tt=' + Invertertime + ',var=' + key + ',val=' + Inverterresults[key] + '\n')
                      }
                      InverterflagPrint = 0
                      InvertersecStop = 0
                      Invertertime = Date.now()
                    }
              //------------------------------------------Inverter----------------------------------------------
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                   if(secEOL>=60 && CntOutEOL){
                      fs.appendFileSync("C:/PULSE/COMET_LOGS/mex_tul_eol_comet.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                      secEOL=0;
                    }else{
                      secEOL++;
                    }
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/

            });//Cierre de lectura
          },1000);
      });//Cierre de cliente

      client3.on('error', function(err){
        clearInterval(intId3);
      });
      client3.on('close', function() {
        clearInterval(intId3);
      });

      function getRejects() {
        var FillerDif = CntInFiller - CntOutFiller
        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Filler_comet.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(FillerDif - FillerReject.rejected) + '\n')
        FillerReject.rejected = FillerDif
        fs.writeFileSync('FillerRejected.json', '{"rejected": ' + FillerReject.rejected + '}')
        var CoderDif = CntInCoder - CntOutCoder
        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Coder_comet.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(CoderDif - CoderReject.rejected) + '\n')
        CoderReject.rejected = CoderDif
        fs.writeFileSync('CoderRejected.json', '{"rejected": ' + CoderReject.rejected + '}')
        var TunnelDif = CntInTunnel - CntOutTunnel //90 minutes of delay
        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Tunnel_comet.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(TunnelDif - TunnelReject.rejected) + '\n')
        TunnelReject.rejected = TunnelDif
        fs.writeFileSync('TunnelRejected.json', '{"rejected": ' + TunnelReject.rejected + '}')
        var WrapperDif = CntInWrapper - CntOutWrapper
        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Wrapper_comet.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(WrapperDif - WrapperReject.rejected) + '\n')
        WrapperReject.rejected = WrapperDif
        fs.writeFileSync('WrapperRejected.json', '{"rejected": ' + WrapperReject.rejected + '}')
        var InverterDif = CntInInverter - CntOutInverter
        fs.appendFileSync('C:/Pulse/COMET_LOGS/mex_tul_Inverter_comet.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(InverterDif - InverterReject.rejected) + '\n')
        InverterReject.rejected = InverterDif
        fs.writeFileSync('InverterRejected.json', '{"rejected": ' + InverterReject.rejected + '}')

      }
      setTimeout(getRejects, 60000);
      var storeReject = setInterval(getRejects, 1740000);

}catch(err){
    fs.appendFileSync("error_Comet.log",err + '\n');
}
