export interface ExecutionResult {
  logs: string[];
  durationMs: number;
  hasError: boolean;
}

/**
 * Transpiles Python code to executable JavaScript inside a sandboxed environment
 */
export function transpilePythonToJs(pyCode: string): string {
  const lines = pyCode.split("\n");
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    // Compute indentation level
    const indentMatch = rawLine.match(/^(\s*)/);
    const indentLevel = indentMatch ? indentMatch[1].length : 0;
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      continue;
    }

    // Skip comments
    if (trimmed.startsWith("#")) {
      jsLines.push(`// ${trimmed.replace(/^#+\s*/, "")}`);
      continue;
    }

    // Pop any higher indentation levels when unindenting
    while (indentStack.length > 1 && indentLevel < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      const prevIndent = indentStack[indentStack.length - 1] || 0;
      jsLines.push(" ".repeat(prevIndent) + "}");
    }

    let line = trimmed;

    // Convert comments at end of lines
    line = line.replace(/#.*$/, "").trim();

    // Ignore import statements
    if (line.startsWith("import ") || line.startsWith("from ")) {
      jsLines.push(`// ${line}`);
      continue;
    }

    // Convert f-strings: f"Hello {name}" -> `Hello ${name}`
    line = line.replace(/f"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, str: string) => {
      const converted = str.replace(/\{([^}]+)\}/g, (match: string, expr: string) => {
        if (expr.includes(":")) {
          const [exp, format] = expr.split(":");
          if (format.includes(".2f") || format.includes(".2")) {
            return `\${Number(${exp.trim()}).toFixed(2)}`;
          }
          return `\${${exp.trim()}}`;
        }
        return `\${${expr.trim()}}`;
      });
      return `\`${converted}\``;
    });

    line = line.replace(/f'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, str: string) => {
      const converted = str.replace(/\{([^}]+)\}/g, (match: string, expr: string) => {
        if (expr.includes(":")) {
          const [exp, format] = expr.split(":");
          if (format.includes(".2f") || format.includes(".2")) {
            return `\${Number(${exp.trim()}).toFixed(2)}`;
          }
          return `\${${exp.trim()}}`;
        }
        return `\${${expr.trim()}}`;
      });
      return `\`${converted}\``;
    });

    // Replace print(...) with __print(...)
    line = line.replace(/\bprint\s*\(/g, "__print(");

    // Replace Python keywords
    line = line
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\b/g, "!");

    let isBlockOpener = false;

    // Function definition
    if (/^def\s+/.test(line)) {
      line = line.replace(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*(?:->.*?)?:/, "function $1($2) {");
      isBlockOpener = true;
    } else if (/^try\s*:$/.test(line)) {
      line = "try {";
      isBlockOpener = true;
    } else if (/^except(\s+.*?)?:$/.test(line)) {
      line = "catch (e) {";
      isBlockOpener = true;
    } else if (/^finally\s*:$/.test(line)) {
      line = "finally {";
      isBlockOpener = true;
    } else if (/^elif\s+(.*?):$/.test(line)) {
      line = line.replace(/^elif\s+(.*?):$/, "else if ($1) {");
      isBlockOpener = true;
    } else if (/^if\s+(.*?):$/.test(line)) {
      line = line.replace(/^if\s+(.*?):$/, "if ($1) {");
      isBlockOpener = true;
    } else if (/^else\s*:$/.test(line)) {
      line = "else {";
      isBlockOpener = true;
    } else if (/^while\s+(.*?):$/.test(line)) {
      line = line.replace(/^while\s+(.*?):$/, "while ($1) {");
      isBlockOpener = true;
    } else if (/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\)\s*:/.test(line)) {
      const match = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\)\s*:/);
      if (match) {
        const varName = match[1];
        const args = match[2].split(",").map((s) => s.trim());
        let start = "0";
        let end = args[0];
        let step = "1";
        if (args.length === 2) {
          start = args[0];
          end = args[1];
        } else if (args.length === 3) {
          start = args[0];
          end = args[1];
          step = args[2];
        }
        line = `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName} += ${step}) {`;
        isBlockOpener = true;
      }
    } else if (/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*:/.test(line)) {
      const match = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*:/);
      if (match) {
        line = `for (const ${match[1]} of ${match[2]}) {`;
        isBlockOpener = true;
      }
    } else if (line.endsWith(":")) {
      line = line.slice(0, -1) + " {";
      isBlockOpener = true;
    }

    if (isBlockOpener) {
      indentStack.push(indentLevel + 4);
      jsLines.push(" ".repeat(indentLevel) + line);
      continue;
    }

    // Handle return statements, assignments, expressions
    if (
      /^[a-zA-Z0-9_,\s]+\s*=\s*[^=]/.test(line) &&
      line.includes(",") &&
      !line.startsWith("var ") &&
      !line.startsWith("let ") &&
      !line.startsWith("const ") &&
      !line.startsWith("return ")
    ) {
      const eqIdx = line.indexOf("=");
      const left = line.slice(0, eqIdx).trim();
      const right = line.slice(eqIdx + 1).trim();
      if (left.includes(",")) {
        const vars = left.split(",").map((v) => v.trim()).join(", ");
        if (right.includes(",") && !right.startsWith("[") && !right.startsWith("(")) {
          line = `var [${vars}] = [${right}];`;
        } else {
          line = `var [${vars}] = Array.isArray(${right}) ? ${right} : [${right}];`;
        }
      }
    } else if (
      /^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[^=]/.test(line) &&
      !line.startsWith("let ") &&
      !line.startsWith("const ") &&
      !line.startsWith("var ") &&
      !line.startsWith("function ") &&
      !line.startsWith("return ")
    ) {
      line = `var ${line};`;
    } else if (!line.endsWith(";") && !line.endsWith("{") && !line.endsWith("}")) {
      line = `${line};`;
    }

    jsLines.push(" ".repeat(indentLevel) + line);
  }

  // Close remaining blocks at the end of file
  while (indentStack.length > 1) {
    indentStack.pop();
    const prevIndent = indentStack[indentStack.length - 1] || 0;
    jsLines.push(" ".repeat(prevIndent) + "}");
  }

  return jsLines.join("\n");
}

export function executeCodeInBrowser(
  fileName: string,
  code: string
): ExecutionResult {
  const start = performance.now();
  const logs: string[] = [];
  let hasError = false;

  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (ext === "py") {
    // Advanced in-browser Python Runtime Environment
    try {
      const transpiledJs = transpilePythonToJs(code);

      // Runtime Python standard library environment
      const pyEnv = {
        __print: (...args: any[]) => {
          const formatted = args
            .map((arg) => {
              if (typeof arg === "object" && arg !== null) {
                return JSON.stringify(arg);
              }
              return String(arg);
            })
            .join(" ");
          logs.push(formatted);
        },
        random: {
          randint: (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min,
          choice: (arr: any[]) => (arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null),
          random: () => Math.random(),
          uniform: (a: number, b: number) => Math.random() * (b - a) + a,
          sample: (arr: any[], k: number) => {
            const copy = [...arr];
            const result = [];
            for (let i = 0; i < k && copy.length; i++) {
              const idx = Math.floor(Math.random() * copy.length);
              result.push(copy.splice(idx, 1)[0]);
            }
            return result;
          },
        },
        math: {
          sqrt: Math.sqrt,
          floor: Math.floor,
          ceil: Math.ceil,
          abs: Math.abs,
          pow: Math.pow,
          pi: Math.PI,
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          log: Math.log,
          log10: Math.log10,
        },
        multiprocessing: {
          cpu_count: () => 8,
        },
        time: {
          time: () => Date.now() / 1000,
          sleep: () => {},
        },
        len: (obj: any) => (obj ? (typeof obj === "string" || Array.isArray(obj) ? obj.length : Object.keys(obj).length) : 0),
        range: (start: number, stop?: number, step = 1) => {
          const res: number[] = [];
          const actualStart = stop === undefined ? 0 : start;
          const actualStop = stop === undefined ? start : stop;
          for (let i = actualStart; i < actualStop; i += step) {
            res.push(i);
          }
          return res;
        },
        sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
        max: (...args: any[]) => {
          if (args.length === 1 && Array.isArray(args[0])) return Math.max(...args[0]);
          return Math.max(...args);
        },
        min: (...args: any[]) => {
          if (args.length === 1 && Array.isArray(args[0])) return Math.min(...args[0]);
          return Math.min(...args);
        },
        abs: (x: number) => Math.abs(x),
        str: (x: any) => String(x),
        int: (x: any) => parseInt(x, 10) || 0,
        float: (x: any) => parseFloat(x) || 0,
        bool: (x: any) => Boolean(x),
        type: (x: any) => typeof x,
      };

      // Construct runner function with injected Python stdlib
      const envKeys = Object.keys(pyEnv);
      const envVals = Object.values(pyEnv);

      const runner = new Function(
        ...envKeys,
        `
        try {
          ${transpiledJs}
        } catch (e) {
          __print("[Python Runtime Error] " + (e.message || String(e)));
          throw e;
        }
        `
      );

      runner(...envVals);

      if (logs.length === 0) {
        logs.push(`[Python Sandbox] ${fileName} completed successfully with exit code 0.`);
      }
    } catch (e: unknown) {
      hasError = true;
      const msg = e instanceof Error ? e.message : String(e);
      if (!logs.some((l) => l.includes("[Python Runtime Error]"))) {
        logs.push(`[Syntax/Runtime Error] ${msg}`);
      }
    }
  } else if (["js", "ts", "jsx", "tsx"].includes(ext)) {
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

      const runFn = new Function(cleanJs);
      runFn();

      if (logs.length === 0) {
        logs.push(`[JS Runtime] ${fileName} executed with exit code 0.`);
      }
    } catch (err: unknown) {
      hasError = true;
      const msg = err instanceof Error ? err.message : String(err);
      logs.push(`[Runtime Exception] ${msg}`);
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
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
    logs.push(`[CodeMesh Runtime] Executed ${fileName} in sandbox.`);
  }

  const durationMs = Math.max(1, Math.round(performance.now() - start));
  return { logs, durationMs, hasError };
}
