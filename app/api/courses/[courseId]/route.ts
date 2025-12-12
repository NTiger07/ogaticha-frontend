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

// GET /api/courses/[courseId] - Get a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId] - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const { title, description, student_emails } = body;

    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update course
    const updatedCourse = {
      ...courses[courseIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(student_emails && { student_emails }),
      updated_at: new Date().toISOString(),
    };

    courses[courseIndex] = updatedCourse;

    return NextResponse.json({
      status: "success",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    courses.splice(courseIndex, 1);

    return NextResponse.json({
      status: "success",
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
