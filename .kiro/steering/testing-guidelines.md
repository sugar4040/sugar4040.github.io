---
inclusion: auto
---

# Testing Guidelines for Kaiyuu Project

## Critical Testing Instructions

### Test Execution Method

**IMPORTANT**: When running tests or verifying test results, you MUST use the chrome-devtools MCP instead of reading bash command output directly.

**Reason**: The agent cannot reliably read test command output from bash. Using chrome-devtools MCP ensures accurate test result verification.

### Correct Approach

1. When tests need to be run, use chrome-devtools MCP tools
2. Navigate to the test page or use appropriate chrome-devtools commands
3. Verify test results through the chrome-devtools interface

### Incorrect Approach

❌ DO NOT rely on reading `npm test` output directly from bash
❌ DO NOT assume test results from command line output

### Remember This

This is a critical instruction that must be followed for all test-related tasks in this project.
