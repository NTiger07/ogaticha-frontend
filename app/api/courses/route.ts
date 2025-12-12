import { NextRequest, NextResponse } from "next/server";

// Mock data store (in production, this would be a database)
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

// GET /api/courses - Get all courses or user courses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const userRole = searchParams.get("role");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let filteredCourses = courses;

    // Filter courses based on user role
    if (userRole === "lecturer") {
      // Lecturers see their own courses
      filteredCourses = courses.filter(
        (course) => course.lecturer_id === userId
      );
    } else {
      // Students see courses they're enrolled in
      // In production, you'd check against the user's email in student_emails
      filteredCourses = courses.filter(
        (course) => course.student_emails.includes("student@example.com") // Mock check
      );
    }

    return NextResponse.json({
      status: "success",
      courses: filteredCourses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, lecturer_id, student_emails = [] } = body;

    if (!title || !lecturer_id) {
      return NextResponse.json(
        { error: "Title and lecturer_id are required" },
        { status: 400 }
      );
    }

    const newCourse = {
      id: `course_${Date.now()}`,
      title,
      description: description || "",
      lecturer_id,
      lecturer_name: "Current Lecturer", // In production, fetch from user database
      student_emails: student_emails || [],
      materials: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    courses.push(newCourse);

    return NextResponse.json({
      status: "success",
      course: newCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
