const fetch = require("node-fetch");

const baseUrl = require("./config").baseUrl;

const fetchSinToken = async (endpoint, data, method = "GET") => {
  //console.log(data);
  const url = `${baseUrl}/${endpoint}`;

  if (method === "GET") {
    const resp = await fetch(url);
    return await resp.json();
  } else {
    const resp = await fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await resp.json();
  }
};

const fetchToken = async (endpoint, data, method = "GET") => {
  //console.log(endpoint, data, method);
  const url = `${baseUrl}/${endpoint}`;

  if (method === "GET") {
    const resp = await fetch(url, {
      headers: {
        Authorization: data.token,
      },
    });
    return await resp.json();
  } else {
    if (method === "DELETE") {
      const resp = await fetch(url, {
        method,
        headers: {
          Authorization: data.token,
        },
      });
      return;
    }
    const resp = await fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        Authorization: data.token,
      },
      body: JSON.stringify(data.data),
    });

    return await resp.json();
  }
};

module.exports = {
  fetchSinToken,
  fetchToken,
};
