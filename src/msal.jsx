import { useMsal } from "@azure/msal-react";

export const useMsalUser = () => {
  const { accounts } = useMsal();
  const account = accounts[0];

  const name = account?.idTokenClaims?.name;
  const email = account?.idTokenClaims?.preferred_username || account?.idTokenClaims?.email;
  const msal_id = account?.idTokenClaims?.oid;

  return { name, email, msal_id };
};