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
  try {
    const response = await fetch(encodeURI(url), {
      method: "post",
      body: JSON.stringify(options),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const results = await response.json();
    return results["message"];
  } catch (e) {
    console.log("post error : " + e);
    return [];
  }
}

export { get, post };
