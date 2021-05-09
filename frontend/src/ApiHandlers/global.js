async function get(url) {
  const response = await fetch(encodeURI(url), {
    method: "get",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const results = await response.json();
  return results["message"];
}

async function post(url, options) {
  const response = await fetch(encodeURI(url), {
    method: "post",
    body: JSON.stringify(options),
    mode: "cors",
    credentials: "include",
    headers: {
      //"Access-Control-Allow-Origin": "*",
      //Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const results = await response.json();
  return results["message"];
}

export { get, post };
