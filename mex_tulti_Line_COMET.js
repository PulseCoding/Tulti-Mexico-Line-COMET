var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try {
  var secPubNub = 0;
  var Tunnelct = null,
    Tunnelresults = null,
    CntInTunnel = null,
    CntInTunnel20 = 0,
    CntOutTunnel = null,
    CntOutTunnel1 = null,
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
    TunneltimeStop = 60, //NOTE: Timestop en segundos
    TunnelWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    TunnelflagRunning = false,
    CntInTunnel1 = null,
    TunneldeltaRejected = null,
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
  var Filler1ct = null,
    Filler1results = null,
    CntInFiller1 = null,
    CntOutFiller1 = null,
    Filler1actual = 0,
    Filler1time = 0,
    Filler1sec = 0,
    Filler1flagStopped = false,
    Filler1state = 0,
    Filler1speed = 0,
    Filler1speedTemp = 0,
    Filler1flagPrint = 0,
    Filler1secStop = 0,
    Filler1ONS = false,
    Filler1timeStop = 60, //NOTE: Timestop en segundos
    Filler1Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    Filler1flagRunning = false;
  var Filler2ct = null,
    Filler2results = null,
    CntInFiller2 = null,
    CntOutFiller2 = null,
    Filler2actual = 0,
    Filler2time = 0,
    Filler2sec = 0,
    Filler2flagStopped = false,
    Filler2state = 0,
    Filler2speed = 0,
    Filler2speedTemp = 0,
    Filler2flagPrint = 0,
    Filler2secStop = 0,
    Filler2ONS = false,
    Filler2timeStop = 60, //NOTE: Timestop en segundos
    Filler2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    Filler2flagRunning = false;
  var Wrapping1ct = null,
    Wrapping1results = null,
    Xray1results = null,
    CntInWrapping1 = null,
    CntOutWrapping1 = null,
    Wrapping1actual = 0,
    Wrapping1time = 0,
    Wrapping1sec = 0,
    Wrapping1flagStopped = false,
    Wrapping1state = 0,
    Wrapping1speed = 0,
    Wrapping1speedTemp = 0,
    Wrapping1flagPrint = 0,
    Wrapping1secStop = 0,
    Wrapping1ONS = false,
    Wrapping1timeStop = 60, //NOTE: Timestop en segundos
    Wrapping1Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    Wrapping1flagRunning = false;
  var Wrapping2ct = null,
    Wrapping2results = null,
    Xray2results = null,
    CntInWrapping2 = null,
    CntOutWrapping2 = null,
    Wrapping2actual = 0,
    Wrapping2time = 0,
    Wrapping2sec = 0,
    Wrapping2flagStopped = false,
    Wrapping2state = 0,
    Wrapping2speed = 0,
    Wrapping2speedTemp = 0,
    Wrapping2flagPrint = 0,
    Wrapping2secStop = 0,
    Wrapping2ONS = false,
    Wrapping2timeStop = 60, //NOTE: Timestop en segundos
    Wrapping2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    Wrapping2flagRunning = false;

  var CntOutEOL = null,
    secEOL = 0;
  var publishConfig;
  var intId1, intId2, intId3, intId4;
  var files = fs.readdirSync("C:/PULSE/INTERBAKE_LOGS/"); //Leer documentos
  var actualdate = Date.now(); //Fecha actual
  var text2send = []; //Vector a enviar
  var flagInfo2Send = 0;
  var i = 0;
  var pubnub = new PubNub({
    publishKey: "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
    subscribeKey: "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
    uuid: "MEX_TUL_INTERBAKE"
  });


  var senderData = function() {
    pubnub.publish(publishConfig, function(status, response) {});
  };

  var client1 = modbus.client.tcp.complete({
    'host': "192.168.10.90",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout': 30000
  });
  var client2 = modbus.client.tcp.complete({
    'host': "192.168.10.91",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout': 30000
  });
  var client3 = modbus.client.tcp.complete({
    'host': "192.168.10.92",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout': 30000
  });
  var client4 = modbus.client.tcp.complete({
    'host': "192.168.10.93",
    'port': 502,
    'autoReconnect': true,
    'timeout': 60000,
    'logEnabled': true,
    'reconnectTimeout': 30000
  });
} catch (err) {
  fs.appendFileSync("error_declarations.log", err + '\n');
}
try {
  client1.connect();
  client2.connect();
  client3.connect();
  client4.connect();
} catch (err) {
  fs.appendFileSync("error_connection.log", err + '\n');
}
try {
  /*----------------------------------------------------------------------------------function-------------------------------------------------------------------------------------------*/
  var joinWord = function(num1, num2) {
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
  if (secPubNub >= 60 * 5) {

    var idle = function() {
      i = 0;
      text2send = [];
      for (var k = 0; k < files.length; k++) { //Verificar los archivos
        var stats = fs.statSync("C:/PULSE/INTERBAKE_LOGS/" + files[k]);
        var mtime = new Date(stats.mtime).getTime();
        if (mtime < (Date.now() - (3 * 60 * 1000)) && files[k].indexOf("serialbox") == -1) {
          flagInfo2Send = 1;
          text2send[i] = files[k];
          i++;
        }
      }
    };
    secPubNub = 0;
    publishConfig = {
      channel: "MEX_TUL_Monitor",
      message: {
        line: "1",
        tt: Date.now(),
        machines: text2send

      }
    };
    senderData();
  }
  secPubNub++;
  //PubNub --------------------------------------------------------------------------------------------------------------------
  client1.on('connect', function(err) {
    intId1 =
      setInterval(function() {
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInTunnel1 = joinWord(resp.register[0], resp.register[1]);
          CntOutFiller1 = joinWord(resp.register[2], resp.register[3]);
          //------------------------------------------Filler1----------------------------------------------
          Filler1ct = CntOutFiller1 //CntOutFiller1 // NOTE: igualar al contador de salida
          if (!Filler1ONS && Filler1ct) {
            Filler1speedTemp = Filler1ct
            Filler1sec = Date.now()
            Filler1ONS = true
            Filler1time = Date.now()
          }
          if (Filler1ct > Filler1actual) {
            if (Filler1flagStopped) {
              Filler1speed = Filler1ct - Filler1speedTemp
              Filler1speedTemp = Filler1ct
              Filler1sec = Date.now()
              Filler1time = Date.now()
            }
            Filler1secStop = 0
            Filler1state = 1
            Filler1flagStopped = false
            Filler1flagRunning = true
          } else if (Filler1ct == Filler1actual) {
            if (Filler1secStop == 0) {
              Filler1time = Date.now()
              Filler1secStop = Date.now()
            }
            if ((Date.now() - (Filler1timeStop * 1000)) >= Filler1secStop) {
              Filler1speed = 0
              Filler1state = 2
              Filler1speedTemp = Filler1ct
              Filler1flagStopped = true
              Filler1flagRunning = false
              Filler1flagPrint = 1
            }
          }
          Filler1actual = Filler1ct
          if (Date.now() - 60000 * Filler1Worktime >= Filler1sec && Filler1secStop == 0) {
            if (Filler1flagRunning && Filler1ct) {
              Filler1flagPrint = 1
              Filler1secStop = 0
              Filler1speed = Filler1ct - Filler1speedTemp
              Filler1speedTemp = Filler1ct
              Filler1sec = Date.now()
            }
          }
          Filler1results = {
            ST: Filler1state,
            CPQO: CntOutFiller1,
            SP: Filler1speed
          }
          if (Filler1flagPrint == 1) {
            for (var key in Filler1results) {
              if (Filler1results[key] != null && !isNaN(Filler1results[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Filler1_INTERBAKE.log', 'tt=' + Filler1time + ',var=' + key + ',val=' + Filler1results[key] + '\n')
            }
            Filler1flagPrint = 0
            Filler1secStop = 0
            Filler1time = Date.now()
          }
          //------------------------------------------Filler1----------------------------------------------
        }); //Cierre de lectura
      }, 1000);
  }); //Cierre de cliente

  client1.on('error', function(err) {
    clearInterval(intId1);
  });
  client1.on('close', function() {
    clearInterval(intId1);
  });
  client2.on('connect', function(err) {
    intId2 =
      setInterval(function() {
        client2.readHoldingRegisters(0, 16).then(function(resp) {
          CntInTunnel = joinWord(resp.register[0], resp.register[1]) + CntInTunnel1;
          CntOutFiller2 = joinWord(resp.register[2], resp.register[3]);
          //------------------------------------------Filler2----------------------------------------------
          Filler2ct = CntOutFiller2 //CntOutFiller2 // NOTE: igualar al contador de salida
          if (!Filler2ONS && Filler2ct) {
            Filler2speedTemp = Filler2ct
            Filler2sec = Date.now()
            Filler2ONS = true
            Filler2time = Date.now()
          }
          if (Filler2ct > Filler2actual) {
            if (Filler2flagStopped) {
              Filler2speed = Filler2ct - Filler2speedTemp
              Filler2speedTemp = Filler2ct
              Filler2sec = Date.now()
              Filler2time = Date.now()
            }
            Filler2secStop = 0
            Filler2state = 1
            Filler2flagStopped = false
            Filler2flagRunning = true
          } else if (Filler2ct == Filler2actual) {
            if (Filler2secStop == 0) {
              Filler2time = Date.now()
              Filler2secStop = Date.now()
            }
            if ((Date.now() - (Filler2timeStop * 1000)) >= Filler2secStop) {
              Filler2speed = 0
              Filler2state = 2
              Filler2speedTemp = Filler2ct
              Filler2flagStopped = true
              Filler2flagRunning = false
              Filler2flagPrint = 1
            }
          }
          Filler2actual = Filler2ct
          if (Date.now() - 60000 * Filler2Worktime >= Filler2sec && Filler2secStop == 0) {
            if (Filler2flagRunning && Filler2ct) {
              Filler2flagPrint = 1
              Filler2secStop = 0
              Filler2speed = Filler2ct - Filler2speedTemp
              Filler2speedTemp = Filler2ct
              Filler2sec = Date.now()
            }
          }
          Filler2results = {
            ST: Filler2state,
            CPQO: CntOutFiller2,
            SP: Filler2speed
          }
          if (Filler2flagPrint == 1) {
            for (var key in Filler2results) {
              if (Filler2results[key] != null && !isNaN(Filler2results[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Filler2_INTERBAKE.log', 'tt=' + Filler2time + ',var=' + key + ',val=' + Filler2results[key] + '\n')
            }
            Filler2flagPrint = 0
            Filler2secStop = 0
            Filler2time = Date.now()
          }
          //------------------------------------------Filler2----------------------------------------------
        }); //Cierre de lectura
      }, 1000);
  }); //Cierre de cliente

  client2.on('error', function(err) {
    clearInterval(intId2);
  });
  client2.on('close', function() {
    clearInterval(intId2);
  });
  client3.on('connect', function(err) {
    intId3 =
      setInterval(function() {
        client3.readHoldingRegisters(0, 16).then(function(resp) {
          CntOutEOL = joinWord(resp.register[0], resp.register[1]);
          CntOutWrapping1 = joinWord(resp.register[2], resp.register[3]); //Xray1 In
          CntInWrapping1 = joinWord(resp.register[4], resp.register[5]);  //Wrapping 1 In
          CntOutTunnel1 = joinWord(resp.register[4], resp.register[5]); //new
          //------------------------------------------Wrapping1----------------------------------------------
          Wrapping1ct = CntOutWrapping1 // NOTE: igualar al contador de salida
          if (!Wrapping1ONS && Wrapping1ct) {
            Wrapping1speedTemp = Wrapping1ct
            Wrapping1sec = Date.now()
            Wrapping1ONS = true
            Wrapping1time = Date.now()
          }
          if (Wrapping1ct > Wrapping1actual) {
            if (Wrapping1flagStopped) {
              Wrapping1speed = Wrapping1ct - Wrapping1speedTemp
              Wrapping1speedTemp = Wrapping1ct
              Wrapping1sec = Date.now()
              Wrapping1time = Date.now()
            }
            Wrapping1secStop = 0
            Wrapping1state = 1
            Wrapping1flagStopped = false
            Wrapping1flagRunning = true
          } else if (Wrapping1ct == Wrapping1actual) {
            if (Wrapping1secStop == 0) {
              Wrapping1time = Date.now()
              Wrapping1secStop = Date.now()
            }
            if ((Date.now() - (Wrapping1timeStop * 1000)) >= Wrapping1secStop) {
              Wrapping1speed = 0
              Wrapping1state = 2
              Wrapping1speedTemp = Wrapping1ct
              Wrapping1flagStopped = true
              Wrapping1flagRunning = false
              Wrapping1flagPrint = 1
            }
          }
          Wrapping1actual = Wrapping1ct
          if (Date.now() - 60000 * Wrapping1Worktime >= Wrapping1sec && Wrapping1secStop == 0) {
            if (Wrapping1flagRunning && Wrapping1ct) {
              Wrapping1flagPrint = 1
              Wrapping1secStop = 0
              Wrapping1speed = Wrapping1ct - Wrapping1speedTemp
              Wrapping1speedTemp = Wrapping1ct
              Wrapping1sec = Date.now()
            }
          }
          Wrapping1results = {
            ST: Wrapping1state,
            CPQI: CntInWrapping1,
            CPQO: CntOutWrapping1,
            SP: Wrapping1speed
          }
          Xray1results = {
            ST: Wrapping1state,
            CPQO: CntOutWrapping1,
            SP: Wrapping1speed
          }
          if (Wrapping1flagPrint == 1) {
            for (var key in Wrapping1results) {
              if (Wrapping1results[key] != null && !isNaN(Wrapping1results[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Wrapping1_INTERBAKE.log', 'tt=' + Wrapping1time + ',var=' + key + ',val=' + Wrapping1results[key] + '\n')
            }
            for (var key in Xray1results) {
              if (Xray1results[key] != null && !isNaN(Xray1results[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Xray1_INTERBAKE.log', 'tt=' + Wrapping1time + ',var=' + key + ',val=' + Xray1results[key] + '\n')
            }
            Wrapping1flagPrint = 0
            Wrapping1secStop = 0
            Wrapping1time = Date.now()
          }
          //------------------------------------------Wrapping1----------------------------------------------
          /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
          if (secEOL >= 60 && CntOutEOL) {
            fs.appendFileSync("C:/PULSE/INTERBAKE_LOGS/mex_tul_eol_INTERBAKE.log", "tt=" + Date.now() + ",var=EOL" + ",val=" + CntOutEOL + "\n");
            secEOL = 0;
          } else {
            secEOL++;
          }
          /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/

        }); //Cierre de lectura
      }, 1000);
  }); //Cierre de cliente

  client3.on('error', function(err) {
    clearInterval(intId3);
  });
  client3.on('close', function() {
    clearInterval(intId3);
  });
  client4.on('connect', function(err) {
    intId4 =
      setInterval(function() {
        client4.readHoldingRegisters(0, 16).then(function(resp) {
          CntOutTunnel = joinWord(resp.register[0], resp.register[1])+ CntOutTunnel1 ;
          CntInWrapping2 = joinWord(resp.register[0], resp.register[1]);
          CntOutWrapping2 = joinWord(resp.register[2], resp.register[3]); //Xray 2 in
          //------------------------------------------Tunnel----------------------------------------------
          Tunnelct = CntOutTunnel // NOTE: igualar al contador de salida
          if (!TunnelONS && Tunnelct) {
            TunnelspeedTemp = Tunnelct
            Tunnelsec = Date.now()
            TunnelONS = true
            Tunneltime = Date.now()
          }
          if (Tunnelct > Tunnelactual) {
            if (TunnelflagStopped) {
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
          } else if (Tunnelct == Tunnelactual) {
            if (TunnelsecStop == 0) {
              Tunneltime = Date.now()
              TunnelsecStop = Date.now()
            }
            if ((Date.now() - (TunneltimeStop * 1000)) >= TunnelsecStop) {
              //Tunnelspeed = 0
              Tunnelstate = 2
              TunnelspeedTemp = Tunnelct
              TunnelflagStopped = true
              TunnelflagRunning = false
              TunnelflagPrint = 1
            }
          }
          Tunnelactual = Tunnelct
          if (Date.now() - 60000 * TunnelWorktime >= Tunnelsec && TunnelsecStop == 0) {
            if (TunnelflagRunning && Tunnelct) {
              TunnelflagPrint = 1
              TunnelsecStop = 0
              Tunnelspeed = Tunnelct - TunnelspeedTemp
              TunnelspeedTemp = Tunnelct
              Tunnelsec = Date.now()
            }
          }
          Tunnelresults = {
            ST: Tunnelstate,
            CPQI: CntInTunnel,
            CPQO: CntOutTunnel,
            SP: Tunnelspeed
          }
          if (TunnelflagPrint == 1) {
            for (var key in Tunnelresults) {
              if (Tunnelresults[key] != null && !isNaN(Tunnelresults[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Tunnel_INTERBAKE.log', 'tt=' + Tunneltime + ',var=' + key + ',val=' + Tunnelresults[key] + '\n')
            }
            TunnelflagPrint = 0
            TunnelsecStop = 0
            Tunneltime = Date.now()
          }
          //------------------------------------------Tunnel----------------------------------------------
          //------------------------------------------Wrapping2----------------------------------------------
          Wrapping2ct = CntOutWrapping2 // NOTE: igualar al contador de salida
          if (!Wrapping2ONS && Wrapping2ct) {
            Wrapping2speedTemp = Wrapping2ct
            Wrapping2sec = Date.now()
            Wrapping2ONS = true
            Wrapping2time = Date.now()
          }
          if (Wrapping2ct > Wrapping2actual) {
            if (Wrapping2flagStopped) {
              Wrapping2speed = Wrapping2ct - Wrapping2speedTemp
              Wrapping2speedTemp = Wrapping2ct
              Wrapping2sec = Date.now()
              Wrapping2time = Date.now()
            }
            Wrapping2secStop = 0
            Wrapping2state = 1
            Wrapping2flagStopped = false
            Wrapping2flagRunning = true
          } else if (Wrapping2ct == Wrapping2actual) {
            if (Wrapping2secStop == 0) {
              Wrapping2time = Date.now()
              Wrapping2secStop = Date.now()
            }
            if ((Date.now() - (Wrapping2timeStop * 1000)) >= Wrapping2secStop) {
              Wrapping2speed = 0
              Wrapping2state = 2
              Wrapping2speedTemp = Wrapping2ct
              Wrapping2flagStopped = true
              Wrapping2flagRunning = false
              Wrapping2flagPrint = 1
            }
          }
          Wrapping2actual = Wrapping2ct
          if (Date.now() - 60000 * Wrapping2Worktime >= Wrapping2sec && Wrapping2secStop == 0) {
            if (Wrapping2flagRunning && Wrapping2ct) {
              Wrapping2flagPrint = 1
              Wrapping2secStop = 0
              Wrapping2speed = Wrapping2ct - Wrapping2speedTemp
              Wrapping2speedTemp = Wrapping2ct
              Wrapping2sec = Date.now()
            }
          }
          Wrapping2results = {
            ST: Wrapping2state,
            CPQI: CntInWrapping2,
            //CPQO: CntOutWrapping2,
            SP: Wrapping2speed
          }
          Xray2results = {
            ST: Wrapping2state,
            CPQI: CntInWrapping2,
            CPQO: CntOutWrapping2,
            SP: Wrapping2speed
          }
          if (Wrapping2flagPrint == 1) {
            for (var key in Wrapping2results) {
              if (Wrapping2results[key] != null && !isNaN(Wrapping2results[key]))
                //NOTE: Cambiar path
                fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Wrapping2_INTERBAKE.log', 'tt=' + Wrapping2time + ',var=' + key + ',val=' + Wrapping2results[key] + '\n')
            }
            for (var key1 in Xray2results) {
                if (Xray2results[key1] != null && !isNaN(Xray2results[key1]))
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Xray2_INTERBAKE.log', 'tt=' + Wrapping2time + ',var=' + key1 + ',val=' + Xray2results[key1] + '\n')
              }
            Wrapping2flagPrint = 0
            Wrapping2secStop = 0
            Wrapping2time = Date.now()
          }
          //------------------------------------------Wrapping2----------------------------------------------
        }); //Cierre de lectura
      }, 1000);
  }); //Cierre de cliente

  client4.on('error', function(err) {
    clearInterval(intId4);
  });
  client4.on('close', function() {
    clearInterval(intId4);
  });
  function getRejects() {
    CntInTunnel20=CntInTunnel
    var TunnelDif = CntInTunnel20 - CntOutTunnel
    fs.appendFileSync('C:/Pulse/INTERBAKE_LOGS/mex_tul_Tunnel_INTERBAKE.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(TunnelDif - TunnelReject.rejected) + '\n')
    TunnelReject.rejected = TunnelDif
    fs.writeFileSync('TunnelRejected.json', '{"rejected": ' + TunnelReject.rejected + '}')
  }
  setTimeout(getRejects, 40000);
  var storeReject = setInterval(getRejects, 1740000);
} catch (err) {
  fs.appendFileSync("error_interbake.log", err + '\n');
}
