import { stringify } from "querystring";

export let get = (url, body, params) => {
  return call(url, "GET", body, params);
};

function call(url, method, body, params) {
  const options = {
    method: method,
    headers: new Headers({ "content-type": "application/json;charset=utf-8" }),
  };

  if (body && Object.keys(body).length) {
     options.body = JSON.stringify(body);
  }

  if (params) {
    url = url + "?" + stringify(params);
  }

  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then((response) => {
      console.debug(response, "test");
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
}
