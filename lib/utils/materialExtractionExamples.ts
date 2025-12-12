// Example: Testing Text Extraction from Materials
// This file demonstrates how to test the material text extraction feature

import {
  extractTextFromFile,
  isSupportedFileType,
  estimateExtractionTime,
} from "@/lib/utils/textExtractor";

/**
 * Example 1: Extract text from a PDF file
 */
async function testPDFExtraction() {
  // In a real scenario, this would come from a file input
  const response = await fetch("/sample.pdf");
  const blob = await response.blob();
  const pdfFile = new File([blob], "lecture-notes.pdf", {
    type: "application/pdf",
  });

  // Check if file is supported
  if (!isSupportedFileType(pdfFile)) {
    console.error("File type not supported");
    return;
  }

  // Estimate extraction time
  const estimatedTime = estimateExtractionTime(pdfFile);
  console.log(`Estimated extraction time: ${estimatedTime}ms`);

  // Extract text
  const result = await extractTextFromFile(pdfFile);

  if (result.success) {
    console.log("✅ PDF Extraction successful!");
    console.log(`📄 Pages: ${result.pages}`);
    console.log(`📝 Word count: ${result.wordCount}`);
    console.log(`📋 Text preview: ${result.text?.substring(0, 200)}...`);
  } else {
    console.error("❌ PDF Extraction failed:", result.error);
  }
}

/**
 * Example 2: Extract text from a DOCX file
 */
async function testDOCXExtraction() {
  const response = await fetch("/sample.docx");
  const blob = await response.blob();
  const docxFile = new File([blob], "assignment.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const result = await extractTextFromFile(docxFile);

  if (result.success) {
    console.log("✅ DOCX Extraction successful!");
    console.log(`📝 Word count: ${result.wordCount}`);
    console.log(`📋 Text preview: ${result.text?.substring(0, 200)}...`);
  } else {
    console.error("❌ DOCX Extraction failed:", result.error);
  }
}

/**
 * Example 3: Extract text from an image using OCR
 */
async function testImageOCRExtraction() {
  const response = await fetch("/whiteboard-photo.jpg");
  const blob = await response.blob();
  const imageFile = new File([blob], "whiteboard.jpg", { type: "image/jpeg" });

  console.log("⏳ Starting OCR... This may take a while");

  const result = await extractTextFromFile(imageFile);

  if (result.success) {
    console.log("✅ Image OCR successful!");
    console.log(`📝 Word count: ${result.wordCount}`);
    console.log(`📋 Extracted text: ${result.text}`);
  } else {
    console.error("❌ Image OCR failed:", result.error);
  }
}

/**
 * Example 4: Upload material with automatic text extraction
 */
async function uploadMaterialWithExtraction(courseId: string, file: File) {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Upload to API (this will automatically extract text and send to backend)
    const response = await fetch(`/api/courses/${courseId}/materials`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      console.log("✅ Material uploaded successfully!");
      console.log("Material details:", result.material);

      if (result.material.extraction_status === "completed") {
        console.log("✅ Text extraction completed");
        console.log(`📝 Extracted ${result.material.word_count} words`);
        if (result.material.pages) {
          console.log(`📄 ${result.material.pages} pages`);
        }
      } else if (result.material.extraction_status === "failed") {
        console.error(
          "❌ Text extraction failed:",
          result.material.extraction_error
        );
      }
    } else {
      console.error("❌ Upload failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error uploading material:", error);
  }
}

/**
 * Example 5: Test multiple file types
 */
async function testAllFileTypes() {
  const testFiles = [
    {
      name: "lecture.pdf",
      type: "application/pdf",
      url: "/samples/lecture.pdf",
    },
    {
      name: "notes.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      url: "/samples/notes.docx",
    },
    {
      name: "whiteboard.jpg",
      type: "image/jpeg",
      url: "/samples/whiteboard.jpg",
    },
    { name: "readme.txt", type: "text/plain", url: "/samples/readme.txt" },
  ];

  for (const testFile of testFiles) {
    console.log(`\n=== Testing ${testFile.name} ===`);

    try {
      const response = await fetch(testFile.url);
      const blob = await response.blob();
      const file = new File([blob], testFile.name, { type: testFile.type });

      // Check if supported
      if (!isSupportedFileType(file)) {
        console.log(`⚠️  ${testFile.name} - Not supported`);
        continue;
      }

      // Estimate time
      const estimatedTime = estimateExtractionTime(file);
      console.log(`⏱️  Estimated time: ${(estimatedTime / 1000).toFixed(2)}s`);

      // Extract
      const result = await extractTextFromFile(file);

      if (result.success) {
        console.log(`✅ Success - ${result.wordCount} words extracted`);
      } else {
        console.log(`❌ Failed - ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${testFile.name}:`, error);
    }
  }
}

/**
 * Example 6: Error handling scenarios
 */
async function testErrorScenarios() {
  // Test 1: Unsupported file type
  const unsupportedFile = new File(["content"], "video.mp4", {
    type: "video/mp4",
  });
  const result1 = await extractTextFromFile(unsupportedFile);
  console.log(
    "Unsupported file test:",
    result1.success ? "❌ FAIL" : "✅ PASS"
  );

  // Test 2: Empty file
  const emptyFile = new File([], "empty.pdf", { type: "application/pdf" });
  const result2 = await extractTextFromFile(emptyFile);
  console.log(
    "Empty file test:",
    result2.success ? "⚠️  Extracted nothing" : "✅ Handled error"
  );

  // Test 3: Check file type validation
  console.log(
    "PDF supported:",
    isSupportedFileType(new File([], "test.pdf", { type: "application/pdf" }))
  );
  console.log(
    "MP4 supported:",
    isSupportedFileType(new File([], "test.mp4", { type: "video/mp4" }))
  );
}

// Export for testing
export {
  testPDFExtraction,
  testDOCXExtraction,
  testImageOCRExtraction,
  uploadMaterialWithExtraction,
  testAllFileTypes,
  testErrorScenarios,
};

// If running in browser console, expose test functions globally
if (typeof window !== "undefined") {
  interface MaterialTests {
    testPDF: typeof testPDFExtraction;
    testDOCX: typeof testDOCXExtraction;
    testImage: typeof testImageOCRExtraction;
    testAll: typeof testAllFileTypes;
    testErrors: typeof testErrorScenarios;
    upload: typeof uploadMaterialWithExtraction;
  }

  (window as typeof window & { materialTests: MaterialTests }).materialTests = {
    testPDF: testPDFExtraction,
    testDOCX: testDOCXExtraction,
    testImage: testImageOCRExtraction,
    testAll: testAllFileTypes,
    testErrors: testErrorScenarios,
    upload: uploadMaterialWithExtraction,
  };
  console.log("📚 Material extraction tests loaded!");
  console.log(
    "Run tests using: materialTests.testPDF(), materialTests.testAll(), etc."
  );
}
