declare module "formidable" {
  import type { IncomingMessage } from "http";

  export interface FormidableFile {
    filepath: string;
    mimetype: string | null;
    size: number;
    originalFilename: string | null;
  }

  type Files = Record<string, FormidableFile | FormidableFile[]>;
  type Fields = Record<string, string | string[]>;
  type ParseCallback = (err: unknown, fields: Fields, files: Files) => void;

  interface FormidableOptions {
    maxFileSize?: number;
    maxFiles?: number;
    keepExtensions?: boolean;
  }

  interface FormidableInstance {
    parse(req: IncomingMessage, cb: ParseCallback): void;
  }

  export function formidable(opts?: FormidableOptions): FormidableInstance;
}
