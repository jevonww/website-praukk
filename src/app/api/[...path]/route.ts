import app from "@/app";
import { createServer } from "http";
import { parse } from "url";

// Helper to run express app inside next.js route handler
async function handleRequest(req: Request) {
  const url = parse(req.url, true);
  const path = url.pathname || "";
  
  // Create a mock IncomingMessage and ServerResponse or use standard express handling via request listener
  return new Promise<Response>(async (resolve) => {
    // Alternatively, use a lightweight adapter or node-mocks-http or just delegate to express if supported
    // But since Next.js Route Handlers take standard Request/Response, we can use a small adapter or supertest-like approach, 
    // OR even simpler: Express can handle standard node req/res. 
    // Let's forward to express app instance directly:
    
    const nodeReq = Object.assign(
      Readable.from(req.body ? [await req.text()] : []),
      {
        method: req.method,
        url: req.url.replace(/^.*\/\/[^/]+/, ''),
        headers: Object.fromEntries(req.headers.entries()),
        socket: {},
        connection: {},
      }
    );

    // Let's use a simpler approach: Express app is a request listener (req, res) => void
    // We can wrap it cleanly.
    let responseBody: any[] = [];
    let responseStatusCode = 200;
    let responseHeaders: Record<string, string> = {};

    const nodeRes = {
      setHeader(name: string, value: string) {
        responseHeaders[name] = value;
      },
      getHeader(name: string) {
        return responseHeaders[name];
      },
      removeHeader(name: string) {
        delete responseHeaders[name];
      },
      writeHead(statusCode: number, headers?: any) {
        responseStatusCode = statusCode;
        if (headers) {
          Object.assign(responseHeaders, headers);
        }
      },
      write(chunk: any) {
        responseBody.push(chunk);
      },
      end(chunk: any) {
        if (chunk) responseBody.push(chunk);
        const bodyBuffer = Buffer.concat(responseBody.map(c => Buffer.isBuffer(c) ? c : Buffer.from(c)));
        resolve(new Response(bodyBuffer, {
          status: responseStatusCode,
          headers: responseHeaders,
        }));
      },
      status(code: number) {
        responseStatusCode = code;
        return this;
      },
      json(data: any) {
        responseHeaders["content-type"] = "application/json";
        this.end(JSON.stringify(data));
      },
      send(data: any) {
        this.end(data);
      },
      locals: {},
    };

    // Invoke express app
    (app as any)(nodeReq, nodeRes);
  });
}

import { Readable } from "stream";

export async function GET(req: Request) { return handleRequest(req); }
export async function POST(req: Request) { return handleRequest(req); }
export async function PUT(req: Request) { return handleRequest(req); }
export async function PATCH(req: Request) { return handleRequest(req); }
export async function DELETE(req: Request) { return handleRequest(req); }
