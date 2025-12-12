import { NextRequest, NextResponse } from "next/server";

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
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // In production, you would upload the file to cloud storage (S3, Azure Blob, etc.)
    // For now, we'll create a mock material entry
    const newMaterial = {
      id: `material_${Date.now()}`,
      name: file.name,
      file_url: `/materials/${file.name}`, // Mock URL
      file_type: file.type,
      uploaded_at: new Date().toISOString(),
    };

    courses[courseIndex].materials.push(newMaterial);
    courses[courseIndex].updated_at = new Date().toISOString();

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
