export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-2",
    BUCKET: "be-grateful-note-uploads"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://b6rj3ee99e.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_IKIkVfi8L",
    APP_CLIENT_ID: "7brbahimbic0caemvp2q4j8lb2",
    IDENTITY_POOL_ID: "us-east-2:5f208fa9-f87e-4fbd-9851-8e593db1cead"
  }
};