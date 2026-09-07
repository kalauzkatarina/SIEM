export const EventResponseSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["INFO", "WARNING", "ERROR"],
      description: "Normalized event severity/type.",
    },
    description: {
      type: "string",
      description: "Concise normalized description derived from the log line.",
    },
  },
  required: ["type", "description"],
};
