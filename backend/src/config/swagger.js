import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:       "InfiniteRealty Admin API",
      version:     "1.0.0",
      description: "REST API for the InfiniteRealty Admin Panel",
    },
    servers: [
      { url: "http://localhost:5000", description: "Development" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         "http",
          scheme:       "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Admin: {
          type: "object",
          properties: {
            _id:       { type: "string" },
            name:      { type: "string" },
            email:     { type: "string", format: "email" },
            isActive:  { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            admin: { $ref: "#/components/schemas/Admin" },
          },
        },
        Property: {
          type: "object",
          properties: {
            _id:          { type: "string" },
            propertyId:   { type: "string", example: "PB1001" },
            name:         { type: "string" },
            listingType:  { type: "string", enum: ["RESALE", "RENTAL"] },
            assetType:    { type: "string" },
            possession:   { type: "string" },
            address:      { type: "object" },
            images:       { type: "array", items: { type: "string" } },
            primaryImage: { type: "string" },
            configuration:{ type: "object" },
            specs:        { type: "object" },
            amenities:    { type: "array", items: { type: "string" } },
            description:  { type: "string" },
            createdAt:    { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status:  { type: "string", example: "ERROR" },
            message: { type: "string" },
          },
        },
        Success: {
          type: "object",
          properties: {
            status: { type: "string", example: "SUCCESS" },
            data:   { type: "object" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerJsdoc(options);