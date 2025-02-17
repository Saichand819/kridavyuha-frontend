

class ResponseError extends Error {
    status: number;
    bodyMessage: number;
    constructor(code: number, bodyMessage: number) {
      super();
      this.status = code;
      this.bodyMessage = bodyMessage;
    }
  }
  
  export async function CheckResponse(
    res: Response,
  ): Promise<{ status: number; body: any; message: string | null }> {
    const body = await res.json();
    return { status: res.status, body, message: body.message };
  }
  
  export function ThrowFor(err: unknown, errFor: { [key: number]: string }) {
    const error: { status: number; message: string } = {
      status: (err as any).status,
      message: (err as any).message || "",
    };
    return new Error(errFor[error.status] || "Something went wrong.");
  }