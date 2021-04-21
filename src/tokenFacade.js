import jwt_decode from "jwt-decode";

function TokenFacade() {
  const setToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };

  const removeToken = () => {
    localStorage.removeItem("jwtToken");
  };

  const decodeToken = (token) => {
    return jwt_decode(token, { complete: true });
  };

  let getDecodedToken = () => {
    let token = getToken();

    if (token) {
      return decodeToken(token);
    }

    return null;
  };

  const isValid = () => {
    const token = getToken();

    if (token) {
      const decodedToken = decodeToken(token);
      const now = new Date().getTime() / 1000;

      if (decodedToken.exp < now) {
        removeToken();
        return false;
      }

      return true;
    }

    return false;
  };

  return { setToken, getToken, removeToken, getDecodedToken, isValid, decodeToken };
}

const tokenFacade = TokenFacade();
export default tokenFacade;
