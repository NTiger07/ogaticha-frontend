// Text Extraction Utilities for Course Materials
// Supports PDF, DOCX, and Image files with OCR

import mammoth from "mammoth";
import Tesseract from "tesseract.js";

export interface ExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
  pages?: number;
  wordCount?: number;
}

/**
 * Extract text from PDF files
 */
export async function extractTextFromPDF(
  fileBuffer: Buffer
): Promise<ExtractionResult> {
  try {
    // Dynamic import for pdf-parse (CommonJS module)
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(fileBuffer);
    const text = data.text.trim();

    return {
      success: true,
      text,
      pages: data.numpages,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to extract PDF text",
    };
  }
}

/**
 * Extract text from DOCX files
 */
export async function extractTextFromDOCX(
  fileBuffer: Buffer
): Promise<ExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    const text = result.value.trim();

    return {
      success: true,
      text,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to extract DOCX text",
    };
  }
}

/**
 * Extract text from images using OCR
 */
export async function extractTextFromImage(
  fileBuffer: Buffer
): Promise<ExtractionResult> {
  try {
    const { data } = await Tesseract.recognize(fileBuffer, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = data.text.trim();

    return {
      success: true,
      text,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error("Image OCR error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to extract image text",
    };
  }
}

/**
 * Extract text from plain text files
 */
export async function extractTextFromPlainText(
  fileBuffer: Buffer
): Promise<ExtractionResult> {
  try {
    const text = fileBuffer.toString("utf-8").trim();

    return {
      success: true,
      text,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error("Text extraction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to extract text",
    };
  }
}

/**
 * Main extraction function - automatically detects file type and extracts text
 */
export async function extractTextFromFile(
  file: File
): Promise<ExtractionResult> {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await extractTextFromPDF(fileBuffer);
    }

    // DOCX files
    if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await extractTextFromDOCX(fileBuffer);
    }

    // DOC files (legacy Word documents - limited support)
    if (fileType === "application/msword" || fileName.endsWith(".doc")) {
      return {
        success: false,
        error: "Legacy .doc files are not supported. Please convert to .docx",
      };
    }

    // Plain text files
    if (
      fileType === "text/plain" ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md")
    ) {
      return await extractTextFromPlainText(fileBuffer);
    }

    // Image files - use OCR
    if (
      fileType.startsWith("image/") ||
      fileName.match(/\.(png|jpg|jpeg|gif|bmp|tiff)$/i)
    ) {
      return await extractTextFromImage(fileBuffer);
    }

    // Unsupported file type
    return {
      success: false,
      error: `Unsupported file type: ${
        fileType || "unknown"
      }. Supported formats: PDF, DOCX, TXT, images (PNG, JPG, etc.)`,
    };
  } catch (error) {
    console.error("File extraction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to extract text from file",
    };
  }
}

/**
 * Validate if a file type is supported for text extraction
 */
export function isSupportedFileType(file: File): boolean {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const supportedExtensions = [
    ".pdf",
    ".docx",
    ".txt",
    ".md",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tiff",
  ];

  return (
    supportedTypes.includes(fileType) ||
    fileType.startsWith("image/") ||
    supportedExtensions.some((ext) => fileName.endsWith(ext))
  );
}

/**
 * Estimate extraction time based on file size and type
 */
export function estimateExtractionTime(file: File): number {
  const sizeInMB = file.size / (1024 * 1024);
  const fileType = file.type.toLowerCase();

  // PDF and DOCX are relatively fast (1-2 seconds per MB)
  if (fileType.includes("pdf") || fileType.includes("word")) {
    return Math.ceil(sizeInMB * 2000); // milliseconds
  }

  // Images with OCR take longer (5-10 seconds per MB)
  if (fileType.startsWith("image/")) {
    return Math.ceil(sizeInMB * 7000); // milliseconds
  }

  // Plain text is very fast
  return Math.ceil(sizeInMB * 100); // milliseconds
}
