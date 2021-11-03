// Copyright 2018-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;

// todo: env vars from cloudformation:
const APIGW_DOMAIN_NAME = "h627krjgbi.execute-api.us-west-1.amazonaws.com";
const APIGW_STAGE = "Prod";

exports.handler = async (event) => {
  console.log("📩️ onevent:", JSON.stringify(event));

  let connectionData;

  try {
    connectionData = await ddb
      .scan({ TableName: TABLE_NAME, ProjectionExpression: "connectionId" })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  console.log(`scanned ${connectionData.Items.length} rows from dynamo.`);

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: APIGW_DOMAIN_NAME + "/" + APIGW_STAGE,
  });

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(event),
        })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb
          .delete({ TableName: TABLE_NAME, Key: { connectionId } })
          .promise();
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};
