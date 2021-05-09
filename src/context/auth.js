async function getAT() {
  let googleId = localStorage.getItem("access_token");
  if (googleId) {
    return googleId;
  } else {
    return "";
  }
}

async function setAT(at) {
  localStorage.setItem("access_token", at);
}

export { getAT, setAT };
