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

// GET /api/courses/user/[userId] - Get courses for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const searchParams = request.nextUrl.searchParams;
    const userRole = searchParams.get("role");
    const userEmail = searchParams.get("email");

    let filteredCourses = courses;

    if (userRole === "lecturer") {
      // Lecturers see their own courses
      filteredCourses = courses.filter(
        (course) => course.lecturer_id === userId
      );
    } else if (userEmail) {
      // Students see courses they're enrolled in
      filteredCourses = courses.filter((course) =>
        course.student_emails.includes(userEmail)
      );
    }

    return NextResponse.json({
      status: "success",
      courses: filteredCourses,
    });
  } catch (error) {
    console.error("Get user courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user courses" },
      { status: 500 }
    );
  }
}
