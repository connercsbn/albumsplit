import Cookies from "js-cookie";
async function handleToken() {
  if (Cookies.get("csrftoken") === undefined) {
    const res = await fetch("https://api.conner.soy/csrf/", {
      credentials: "include",
    });
    const json = await res.json();
    Cookies.set("csrftoken", json.csrfToken);
  }
}
export default handleToken;
