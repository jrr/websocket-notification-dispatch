// Copyright 2018-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_NAME, APIGW_ENDPOINT } = process.env;

exports.handler = async (event) => {
  // console.log("📩️  onevent:", JSON.stringify(event));

  const { detail } = event;
  const { to, message } = detail;
  console.log(`📩️  onevent: To: '${to}': ->\t'${message}'`);
  console.log("API GW endpoint", APIGW_ENDPOINT);

  let connectionData;

  try {
    connectionData = await ddb.scan({ TableName: TABLE_NAME }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: APIGW_ENDPOINT,
  });

  const matchingConnections = connectionData.Items.filter(
    (c) => c.userId === to
  );

  console.log(
    `📩️  onevent: Relaying message to ${matchingConnections.length} websocket connections.`
  );

  const postCalls = matchingConnections.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(event.detail.message),
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
