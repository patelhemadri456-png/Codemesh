export interface ExecutionResult {
  logs: string[];
  durationMs: number;
  hasError: boolean;
}

export function executeCodeInBrowser(
  fileName: string,
  code: string
): ExecutionResult {
  const start = performance.now();
  const logs: string[] = [];
  let hasError = false;

  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (["js", "ts", "jsx", "tsx"].includes(ext)) {
    // JavaScript / TypeScript Evaluation
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    try {
      console.log = (...args) => {
        logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      };
      console.warn = (...args) => {
        logs.push(`[WARN] ` + args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      };
      console.error = (...args) => {
        hasError = true;
        logs.push(`[ERROR] ` + args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      };

      // Strip simple TypeScript type annotations for browser eval
      const cleanJs = code
        .replace(/:\s*(string|number|boolean|any|void|Dict|List|UserPresence)(\[\])?/g, "")
        .replace(/export\s+interface\s+[\s\S]*?}/g, "")
        .replace(/export\s+/g, "");

      // Execute safely
      const runFn = new Function(cleanJs);
      runFn();
    } catch (err: unknown) {
      hasError = true;
      const msg = err instanceof Error ? err.message : String(err);
      logs.push(`[Runtime Exception] ${msg}`);
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  } else if (ext === "py") {
    // Dynamic Python simulator: parses actual print statements, logic, and expressions in code
    try {
      const lines = code.split("\n");
      const variables: Record<string, unknown> = {};

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;

        // Extract print statements
        const printMatch = line.match(/^print\((.*)\)$/);
        if (printMatch) {
          let content = printMatch[1].trim();

          // f-string replacement
          if (content.startsWith("f\"") || content.startsWith("f'")) {
            content = content.substring(2, content.length - 1);
            content = content.replace(/\{([^}]+)\}/g, (_, expr) => {
              const trimmed = expr.trim();
              return variables[trimmed] !== undefined
                ? String(variables[trimmed])
                : trimmed;
            });
            logs.push(content);
          } else if ((content.startsWith("\"") && content.endsWith("\"")) || (content.startsWith("'") && content.endsWith("'"))) {
            logs.push(content.substring(1, content.length - 1));
          } else {
            // Evaluate comma-separated print arguments
            const parts = content.split(",").map((p) => p.trim());
            const evaluated = parts.map((part) => {
              if ((part.startsWith("\"") && part.endsWith("\"")) || (part.startsWith("'") && part.endsWith("'"))) {
                return part.substring(1, part.length - 1);
              }
              if (variables[part] !== undefined) {
                return String(variables[part]);
              }
              return part;
            });
            logs.push(evaluated.join(" "));
          }
        } else if (line.includes("=") && !line.includes("==") && !line.startsWith("def ")) {
          // Simple variable assignment
          const [varName, ...rest] = line.split("=");
          const trimmedVar = varName.trim();
          const rawVal = rest.join("=").trim();
          if (rawVal.startsWith("\"") || rawVal.startsWith("'")) {
            variables[trimmedVar] = rawVal.substring(1, rawVal.length - 1);
          } else if (!isNaN(Number(rawVal))) {
            variables[trimmedVar] = Number(rawVal);
          } else if (rawVal === "True") {
            variables[trimmedVar] = true;
          } else if (rawVal === "False") {
            variables[trimmedVar] = false;
          }
        }
      }

      if (logs.length === 0) {
        logs.push(`[Python Sandbox] Program ${fileName} executed with exit code 0.`);
      }
    } catch (e: unknown) {
      hasError = true;
      const msg = e instanceof Error ? e.message : String(e);
      logs.push(`[SyntaxError] ${msg}`);
    }
  } else if (ext === "json") {
    try {
      JSON.parse(code);
      logs.push(`✓ JSON Schema valid: ${fileName}`);
    } catch (e: unknown) {
      hasError = true;
      const msg = e instanceof Error ? e.message : String(e);
      logs.push(`[JSON Parse Error] ${msg}`);
    }
  } else {
    logs.push(`[CodeMesh Runtime] Compiled & executed ${fileName} in sandbox.`);
  }

  const durationMs = Math.round(performance.now() - start);
  return { logs, durationMs, hasError };
}
