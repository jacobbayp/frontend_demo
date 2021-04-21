import tokenFacade from './tokenFacade'
import jwt_decode from "jwt-decode";
const URL = "http://localhost:8080";
 
function handleHttpErrors(res) {
 if (!res.ok) {
   return Promise.reject({ status: res.status, fullError: res.json() })
 }
 return res.json();
}
 
function apiFacade() {
 /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/
 const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
  }
const getToken = () => {
  return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
  const loggedIn = getToken() != null;
  return loggedIn;
}
const logout = () => {
  localStorage.removeItem("jwtToken");
}

 
const login = (user, password) => {
    const options = makeOptions("POST", false,{username: user, password: password });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {setToken(res.token) })
 }
const fetchData = () => {
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
  let tokenFinished = getDecodedToken();
  
    let roles = tokenFinished.roles;
    let rolesArr = [];
    rolesArr = roles.split(",");
    let options = "";
    if(rolesArr.includes("admin")){
     options = makeOptions("GET", true); //True adds the token
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    } else
    options = makeOptions("GET", true); //True adds the token
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
 }
const makeOptions= (method,addToken,body) =>{
   var opts = {
     method: method,
     headers: {
       "Content-type": "application/json",
       'Accept': 'application/json',
     }
   }
   if (addToken && loggedIn()) {
     opts.headers["x-access-token"] = getToken();
   }
   if (body) {
     opts.body = JSON.stringify(body);
   }
   return opts;
 }

 return {
     makeOptions,
     setToken,
     getToken,
     loggedIn,
     login,
     logout,
     fetchData
 }
}
const facade = apiFacade();
export default facade;
