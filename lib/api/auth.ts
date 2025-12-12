// Authentication API Functions

import { API_CONFIG, getApiUrl } from "./config";
import {
  RegisterRequest,
  RegisterResponse,
  APIError,
  APIResponse,
} from "../types/api";

/**
 * Register a new user
 */
export async function registerUser(
  data: RegisterRequest
): Promise<APIResponse<RegisterResponse>> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Registration failed",
      };
    }

    return {
      success: true,
      data: responseData as RegisterResponse,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH_CHECK), {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<
  APIResponse<{ message: string; status: string }>
> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.TEST_DB), {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Database connection test failed",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Database test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
