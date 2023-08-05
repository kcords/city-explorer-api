"use strict";

const axios = require("axios").default;

const axiosInstance = axios.create({
  timeout: 5000,
});

module.exports = axiosInstance;
