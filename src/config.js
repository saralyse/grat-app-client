const dev = {
  STRIPE_KEY: "pk_test_AFK62EhDOCPeSRWvpB5TdBnD",
  s3: {
    REGION: "us-east-1",
    BUCKET: "grat-app-api-dev-attachmentsbucket-nehjjfowddzx"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://urnxs45kbh.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_rYwHvAkxj",
    APP_CLIENT_ID: "1gpui6rhl5jprils24a7lsqacr",
    IDENTITY_POOL_ID: "us-east-1:f4beedef-96d1-4a7c-b47e-4fbcbf560f50"
  }
};

const prod = {
  STRIPE_KEY: "pk_test_AFK62EhDOCPeSRWvpB5TdBnD",
  s3: {
    REGION: "us-east-1",
    BUCKET: "grat-app-api-prod-attachmentsbucket-1kn5qo0jamvkr"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://m3ufg7kf13.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_we28aVZWy",
    APP_CLIENT_ID: "6a17ppatoq9uju2c080gtesuij",
    IDENTITY_POOL_ID: "us-east-1:293323bc-0559-40e5-a0bf-c0c7e39c0e18"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};