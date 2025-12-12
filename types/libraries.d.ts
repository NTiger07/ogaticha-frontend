// Type declarations for libraries without official type definitions

declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  export = pdfParse;
}

declare module "mammoth" {
  interface ConvertOptions {
    buffer?: Buffer;
    path?: string;
  }

  interface ConvertResult {
    value: string;
    messages: any[];
  }

  export function extractRawText(
    options: ConvertOptions
  ): Promise<ConvertResult>;
  export function convertToHtml(
    options: ConvertOptions
  ): Promise<ConvertResult>;
  export function convertToMarkdown(
    options: ConvertOptions
  ): Promise<ConvertResult>;
}
