
const path = require("path");

const AppConst = {
  devEnv: "development",
  prodEnv: "production",
};

const getEnvironment = () => {
  return process.env.NODE_ENV ?? AppConst.devEnv;
};

const getBaseUrl = () => {
  return `${process.env.PROTOCOL}://${process.env.HOST}`;
};



module.exports = {
  getBaseUrl,
  getEnvironment,

};
