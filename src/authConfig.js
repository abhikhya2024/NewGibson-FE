// export const msalConfig = {
//   auth: {
//     clientId: "e596e8d9-ec3b-4e87-bee0-89e9bd395b6e",
//     authority: "https://login.microsoftonline.com/b917edf1-b482-4145-a6a5-c028777c3168", // Or "common"
//     redirectUri: "http://localhost:3000/testimony",
//     postLogoutRedirectUri: "http://localhost:3000/login",  // 👈 after logout

//   },
// cache: {
//     cacheLocation: "localStorage",  // or "sessionStorage"
//     storeAuthStateInCookie: false,
//   },
// };

// export const loginRequest = {
//   scopes: ["Files.Read", "Sites.Read.All"],
// };

// export const msalConfig = {
//   auth: {
//     clientId: "e596e8d9-ec3b-4e87-bee0-89e9bd395b6e",
//     authority: "https://login.microsoftonline.com/b917edf1-b482-4145-a6a5-c028777c3168", // Or "common"
//     redirectUri: "http://localhost:3000/testimony",
//   },
//   cache: {
//     cacheLocation: "localStorage", // 👈 Required for persistence
//     storeAuthStateInCookie: true,  // 👈 Needed for IE/Edge legacy support
//   }
// };
// export const loginRequest = {
//   scopes: ["User.Read"], // Or other scopes you configured
// };


//----------------------------Farrar and Ball-----------------------------------------------------
export const msalConfig = {
  auth: {
    clientId: "8f345c17-47b8-4069-ac2b-be3e2bde258e",
    authority: "https://login.microsoftonline.com/b917edf1-b482-4145-a6a5-c028777c3168", // Or "common"
    redirectUri: "http://localhost:3000/testimony",
  },
  cache: {
    cacheLocation: "localStorage", // 👈 Required for persistence
    storeAuthStateInCookie: true,  // 👈 Needed for IE/Edge legacy support
  }
};
export const loginRequest = {
  scopes: ["User.Read"], // Or other scopes you configured
};