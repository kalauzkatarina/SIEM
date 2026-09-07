export const CorrelationResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      correlationDetected: {
        type: "boolean",
        description: "True if a correlation is found.",
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence score in [0, 1].",
      },
      description: {
        type: "string",
        description: "Short explanation of the detected pattern.",
      },
      severity: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        description: "Assessed severity level.",
      },
      category: {
        type: "string",
        description:
          "Correlation category. Must be one of: DDOS, BRUTE_FORCE, MALWARE, PHISHING, EXPLOITATION, DATA_EXFILTRATION, MISCONFIGURATION, POLICY_VIOLATION, OTHER.",
      },
      correlatedEventIds: {
        type: "array",
        items: { type: "integer" },
        description: "IDs of input events participating in the correlation.",
      },
    },
    required: [
      "correlationDetected",
      "confidence",
      "description",
      "severity",
      "category",
      "correlatedEventIds",
    ],
  },
};
