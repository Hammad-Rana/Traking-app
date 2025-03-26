import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_pFH9EAqyb",
  ClientId: "13c45mooksb7g74o8kmk1rgb3n",
};

export default new CognitoUserPool(poolData);
