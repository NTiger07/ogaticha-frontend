// Course Management API Functions

import { API_CONFIG, getApiUrl, validateFileSize } from "./config";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
  GetCoursesResponse,
  GetCourseResponse,
  AddStudentsToCourseRequest,
  AddStudentsToCourseResponse,
  UploadMaterialResponse,
  DeleteCourseResponse,
  APIError,
  APIResponse,
} from "../types/api";

/**
 * Create a new course (Lecturer only)
 */
export async function createCourse(
  courseData: CreateCourseRequest,
  token?: string
): Promise<APIResponse<CreateCourseResponse>> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COURSES), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(courseData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to create course",
      };
    }

    return {
      success: true,
      data: responseData as CreateCourseResponse,
    };
  } catch (error) {
    console.error("Create course error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Get all courses (for lecturers) or enrolled courses (for students)
 */
export async function getCourses(
  userId: string,
  userRole?: string,
  token?: string
): Promise<APIResponse<GetCoursesResponse>> {
  try {
    // Use different endpoints based on role
    const endpoint =
      userRole === "lecturer"
        ? API_CONFIG.ENDPOINTS.LECTURER_COURSES(userId)
        : API_CONFIG.ENDPOINTS.STUDENT_COURSES(userId);

    const response = await fetch(getApiUrl(endpoint), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to fetch courses",
      };
    }

    return {
      success: true,
      data: responseData as GetCoursesResponse,
    };
  } catch (error) {
    console.error("Get courses error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Get a specific course by ID
 */
export async function getCourse(
  courseId: string,
  token?: string
): Promise<APIResponse<GetCourseResponse>> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.COURSE, courseId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to fetch course",
      };
    }

    return {
      success: true,
      data: responseData as GetCourseResponse,
    };
  } catch (error) {
    console.error("Get course error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Update course details (Lecturer only)
 */
export async function updateCourse(
  courseId: string,
  updates: UpdateCourseRequest,
  token?: string
): Promise<APIResponse<UpdateCourseResponse>> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.COURSE, courseId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updates),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to update course",
      };
    }

    return {
      success: true,
      data: responseData as UpdateCourseResponse,
    };
  } catch (error) {
    console.error("Update course error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Add students to a course (Lecturer only)
 */
export async function addStudentsToCourse(
  courseId: string,
  studentEmails: string[],
  token?: string
): Promise<APIResponse<AddStudentsToCourseResponse>> {
  try {
    const requestData: AddStudentsToCourseRequest = {
      student_emails: studentEmails,
    };

    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.COURSE_STUDENTS, courseId),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to add students to course",
      };
    }

    return {
      success: true,
      data: responseData as AddStudentsToCourseResponse,
    };
  } catch (error) {
    console.error("Add students error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Upload course material (Lecturer only)
 */
export async function uploadCourseMaterial(
  courseId: string,
  file: File,
  token?: string
): Promise<APIResponse<UploadMaterialResponse>> {
  try {
    // Validate file size
    if (!validateFileSize(file)) {
      return {
        success: false,
        error: `File size exceeds maximum limit of ${
          API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.COURSE_MATERIALS, courseId),
      {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to upload material",
      };
    }

    return {
      success: true,
      data: responseData as UploadMaterialResponse,
    };
  } catch (error) {
    console.error("Upload material error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Delete a course (Lecturer only)
 */
export async function deleteCourse(
  courseId: string,
  token?: string
): Promise<APIResponse<DeleteCourseResponse>> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.COURSE, courseId),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to delete course",
      };
    }

    return {
      success: true,
      data: responseData as DeleteCourseResponse,
    };
  } catch (error) {
    console.error("Delete course error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Remove a student from a course (Lecturer only)
 */
export async function removeStudentFromCourse(
  courseId: string,
  studentId: string,
  token?: string
): Promise<APIResponse<DeleteCourseResponse>> {
  try {
    const response = await fetch(
      getApiUrl(
        API_CONFIG.ENDPOINTS.COURSE_STUDENT_REMOVE,
        courseId,
        studentId
      ),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to remove student",
      };
    }

    return {
      success: true,
      data: responseData as DeleteCourseResponse,
    };
  } catch (error) {
    console.error("Remove student error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Delete a course material (Lecturer only)
 */
export async function deleteCourseMaterial(
  courseId: string,
  materialId: string,
  token?: string
): Promise<APIResponse<DeleteCourseResponse>> {
  try {
    const response = await fetch(
      getApiUrl(
        API_CONFIG.ENDPOINTS.COURSE_MATERIAL_DELETE,
        courseId,
        materialId
      ),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to delete material",
      };
    }

    return {
      success: true,
      data: responseData as DeleteCourseResponse,
    };
  } catch (error) {
    console.error("Delete material error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Download a course material
 */
export async function downloadCourseMaterial(
  courseId: string,
  materialId: string,
  token?: string
): Promise<APIResponse<Blob>> {
  console.log("=== downloadCourseMaterial API Start ===");
  console.log("Parameters:", { courseId, materialId, hasToken: !!token });

  try {
    // Construct URL directly
    const endpoint = `/api/classroom/courses/${courseId}/materials/${materialId}/download`;
    const url = getApiUrl(endpoint);
    console.log("Request URL:", url);
    console.log("Request headers:", {
      Authorization: token ? `Bearer ${token.substring(0, 10)}...` : "None",
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
      contentDisposition: response.headers.get("content-disposition"),
    });

    if (!response.ok) {
      console.error("Response not OK, status:", response.status);
      const errorData = (await response.json()) as APIError;
      console.error("Error data:", errorData);
      return {
        success: false,
        error: errorData.error || "Failed to download material",
      };
    }

    console.log("Converting response to blob...");
    const blob = await response.blob();
    console.log("Blob created:", {
      size: blob.size,
      type: blob.type,
    });

    console.log("=== downloadCourseMaterial API Success ===");
    return {
      success: true,
      data: blob,
    };
  } catch (error) {
    console.error("=== downloadCourseMaterial API Error ===");
    console.error("Download material error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
