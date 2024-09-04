const AWS = require('aws-sdk');
const iotwireless = new AWS.IoTWireless();
const uplinkDecoder =  (bytes) => {
// Convert hex string to buffer
const messageBuffer = Buffer.from(bytes, 'hex');
    const decodedData = {
        portNumber : messageBuffer.readUInt8(0),
        ulCountApp : messageBuffer.readUInt16BE(1),
        ulCountAppdl : messageBuffer.readUInt16BE(3),
        ulPrevdlPktRSSI : messageBuffer.readInt16BE(5),
        ulDeviceRebootCount : messageBuffer.readUInt16BE(7),
        ulUTCTxTime : messageBuffer.readUInt32BE(9),
        ulPrevdlRxUTCTime : messageBuffer.readUInt32BE(13),
        ulLastUlFailReason : messageBuffer.readInt8(17)
    };
    const dimensions = [
        { Name:'portNumber' , Value: decodedData.portNumber.toString() },
        { Name:'ulCountApp' , Value: decodedData.ulCountApp.toString() },
        { Name:'ulCountAppdl' , Value: decodedData.ulCountAppdl.toString() },
        { Name:'ulPrevdlPktRSSI' , Value: decodedData.ulPrevdlPktRSSI.toString() },
        { Name:'ulDeviceRebootCount' , Value: decodedData.ulDeviceRebootCount.toString() },
        { Name:'ulUTCTxTime' , Value: decodedData.ulUTCTxTime.toString() },
        { Name:'ulPrevdlRxUTCTime' , Value: decodedData.ulPrevdlRxUTCTime.toString() },
        { Name:'ulLastUlFailReason' , Value:  decodedData.ulLastUlFailReason.toString() }
      ];
    return dimensions;
};
const sendDataToWirelessDevice = (params) => {
    return new Promise((resolve) => {
        iotwireless.sendDataToWirelessDevice(params, function (err, data) {
          if (err) console.log(err); // an error occurred
          else console.log(data); // successful response
          resolve();
        });
    });
};
module.exports={
    uplinkDecoder,
    sendDataToWirelessDevice
}