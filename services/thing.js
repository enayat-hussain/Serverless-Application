const AWS = require('aws-sdk');
const timestreamWrite = new AWS.TimestreamWrite();
const timestreamQuery = new AWS.TimestreamQuery();
const nodemailer = require('nodemailer');
const json2csv = require('json2csv').parse;
const { uplinkDecoder, sendDataToWirelessDevice } = require('../utils/common-function');
const { sendEmail } = require('../helpers/mail');
const envConfig = require('../env.json');
const iotdata = new AWS.IotData({
  endpoint: envConfig.IOT_ENDPOINT
});
module.exports.upLink = async (bytes) => {
  const records= uplinkDecoder(bytes);
  const currentTime = Date.now().toString();
  const params = {
    DatabaseName: envConfig.TIMESTREAM_DB_NAME,
    TableName: envConfig.TIMESTREAM_TABLE_NAME,
    Records: [{
      Dimensions: records,
      MeasureName: 'Uplink devices',
      MeasureValue: `uplink devices`,
      MeasureValueType: 'VARCHAR',
      Time: currentTime.toString()
    }],
  }; 
  try {
    await timestreamWrite.writeRecords(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully wrote record to Timestream database'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'failed to write record to Timestream database',
        error: err
      })
    };
  }
};
module.exports.downLink = async (params) => {
  try {
    await sendDataToWirelessDevice(params);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message successfully published to topic'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to publish message to topic',
        error: err
      })
    };
  }
};
module.exports.exportData = async (params) => {
  try {
    const results = await timestreamQuery.query(params).promise();
    await sendEmail(results);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully exported the data adn',
        data: results
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to export the data',
        error: err
      })
    };
  }
}

