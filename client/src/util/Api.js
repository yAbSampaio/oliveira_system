import axios from "axios";
//export const API_URL = "http://localhost:3334/";
export const API_URL =
  "http://localhost:8080";
//
export const routeRegister = (data) => {
  return axios.post(API_URL + "/registerClient", data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeGetClient = (data) => {
  return axios.post(API_URL + "/profile", data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeEdit = (data) => {
  return axios.post(API_URL + "/profile/edit", data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routePay = (data) => {
  return axios.post(API_URL + "/addPayment", data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeListClient = (data) => {
  return axios.post(API_URL + "/list",data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeListLiqui = (data) => {
  return axios.post(API_URL + "/listQuit",data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeSearchClient = (data) => {
  return axios.post(API_URL + "/getSearch",data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeHistoric = (data) => {
  return axios.post(API_URL + "/getHistoric",data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};

export const routeBalance = (data) => {
  return axios.post(API_URL + "/getBalance",data).then(
    function (res) {
      let data = res.data;
      return data;
    }.bind(this)
  );
};