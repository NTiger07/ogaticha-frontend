import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/utils/textExtractor";
import { processMaterialText } from "@/lib/api/courses";

// Mock data store
let courses = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript",
    lecturer_id: "lecturer1",
    lecturer_name: "Dr. Smith",
    student_emails: ["student1@example.com", "student2@example.com"],
    materials: [
      {
        id: "m1",
        name: "Week 1 - HTML Basics.pdf",
        file_url: "/materials/html-basics.pdf",
        file_type: "application/pdf",
        uploaded_at: new Date().toISOString(),
      },
    ],
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// POST /api/courses/[courseId]/materials - Upload course material
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Extract text from the file
    console.log(`Starting text extraction for: ${file.name}`);
    const extractionResult = await extractTextFromFile(file);

    // Create material entry with extraction data
    const newMaterial = {
      id: `material_${Date.now()}`,
      name: file.name,
      file_url: `/materials/${file.name}`, // Mock URL
      file_type: file.type,
      uploaded_at: new Date().toISOString(),
      extracted_text: extractionResult.success
        ? extractionResult.text
        : undefined,
      extraction_status: extractionResult.success
        ? ("completed" as const)
        : ("failed" as const),
      extraction_error: extractionResult.error,
      word_count: extractionResult.wordCount,
      pages: extractionResult.pages,
    };

    courses[courseIndex].materials.push(newMaterial);
    courses[courseIndex].updated_at = new Date().toISOString();

    console.log(
      `Text extraction ${
        extractionResult.success ? "successful" : "failed"
      } for: ${file.name}`
    );
    if (extractionResult.success) {
      console.log(
        `Extracted ${extractionResult.wordCount} words from ${file.name}`
      );
    }

    // If extraction was successful, send the extracted text to the backend
    if (extractionResult.success && extractionResult.text) {
      console.log("Sending extracted text to backend...");

      const backendResult = await processMaterialText({
        material_id: newMaterial.id,
        course_id: courseId,
        extracted_text: extractionResult.text,
        file_name: file.name,
        file_type: file.type,
        word_count: extractionResult.wordCount,
        pages: extractionResult.pages,
      });

      if (backendResult.success) {
        console.log("Successfully sent extracted text to backend");
      } else {
        console.error(
          "Failed to send extracted text to backend:",
          backendResult.error
        );
        // Note: We still return success for the upload, but log the backend sync error
      }
    }

    return NextResponse.json({
      status: "success",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Upload material error:", error);
    return NextResponse.json(
      { error: "Failed to upload material" },
      { status: 500 }
    );
  }
}
