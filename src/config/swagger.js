const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API documentation for the Task Management system",
    },
    servers: [
      {
        url: "http://localhost:8000", // Update with your server URL
      },
    ],
  },
  apis: ["*./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
