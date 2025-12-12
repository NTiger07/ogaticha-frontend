// Authentication API Functions

import { API_CONFIG, getApiUrl } from "./config";
import {
  RegisterRequest,
  RegisterResponse,
  APIError,
  APIResponse,
} from "../types/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  status: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: "student" | "lecturer";
    disability_type?: "visual" | "hearing" | "none";
    preferred_mode?: "text" | "audio" | "visual";
  };
  token: string;
}

/**
 * Login user
 */
export async function loginUser(
  data: LoginRequest
): Promise<APIResponse<LoginResponse>> {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
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
        error: errorData.error || "Login failed",
      };
    }

    return {
      success: true,
      data: responseData as LoginResponse,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

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
 * Update user profile
 */
export async function updateUserProfile(
  updates: { name?: string },
  token: string
): Promise<APIResponse<LoginResponse["user"]>> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROFILE),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to update profile",
      };
    }

    return {
      success: true,
      data: responseData.data || responseData.user,
    };
  } catch (error) {
    console.error("Update profile error:", error);
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

/**
 * Update user settings and profile information
 */
export async function updateUserSettings(
  settings: {
    user_id?: string;
    name?: string;
    selected_voice?: string;
    dark_mode?: boolean;
    notifications?: boolean;
    voice_mode?: boolean;
    font_size?: string;
    high_contrast?: boolean;
    offline_mode?: boolean;
    auto_download?: boolean;
    lecturers?: Array<{ id: string; enabled: boolean }>;
    companions?: Array<{ id: string; enabled: boolean }>;
  },
  token: string
): Promise<APIResponse<{ message: string; user: any }>> {
  try {
    const { user_id, ...payload } = settings;

    if (!user_id) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    console.log("updateUserSettings called with:", {
      user_id,
      payload,
      hasToken: !!token,
    });

    const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_USER, user_id);
    console.log("Endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to update settings",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Update settings error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
