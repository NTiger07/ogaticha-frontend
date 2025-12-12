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

// POST /api/courses/[courseId]/students - Add students to a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const { student_emails } = body;

    if (
      !student_emails ||
      !Array.isArray(student_emails) ||
      student_emails.length === 0
    ) {
      return NextResponse.json(
        { error: "student_emails array is required" },
        { status: 400 }
      );
    }

    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Add new emails, avoiding duplicates
    const existingEmails = new Set(courses[courseIndex].student_emails);
    student_emails.forEach((email) => {
      if (email && !existingEmails.has(email)) {
        courses[courseIndex].student_emails.push(email);
      }
    });

    courses[courseIndex].updated_at = new Date().toISOString();

    return NextResponse.json({
      status: "success",
      course: courses[courseIndex],
    });
  } catch (error) {
    console.error("Add students error:", error);
    return NextResponse.json(
      { error: "Failed to add students to course" },
      { status: 500 }
    );
  }
}
