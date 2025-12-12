// Sync/Offline API Functions

import { API_CONFIG, getApiUrl } from "./config";
import { DownloadOfflinePackResponse, APIResponse } from "../types/api";

export type SubjectType =
  | "general"
  | "physics"
  | "biology"
  | "chemistry"
  | "mathematics"
  | "english";

/**
 * Download offline content pack
 */
export async function downloadOfflinePack(
  subject: SubjectType = "general"
): Promise<APIResponse<DownloadOfflinePackResponse>> {
  try {
    const url = new URL(getApiUrl(API_CONFIG.ENDPOINTS.DOWNLOAD_PACK));
    url.searchParams.append("subject", subject);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to download offline pack",
      };
    }

    return {
      success: true,
      data: responseData as DownloadOfflinePackResponse,
    };
  } catch (error) {
    console.error("Download offline pack error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Save offline pack to localStorage
 */
export function saveOfflinePackToStorage(
  data: DownloadOfflinePackResponse,
  subject: SubjectType
): boolean {
  try {
    const key = `ogaticha_offline_pack_${subject}`;
    const dataToStore = {
      ...data,
      downloaded_at: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(dataToStore));
    return true;
  } catch (error) {
    console.error("Failed to save offline pack:", error);
    return false;
  }
}

/**
 * Get offline pack from localStorage
 */
export function getOfflinePackFromStorage(
  subject: SubjectType
): DownloadOfflinePackResponse | null {
  try {
    const key = `ogaticha_offline_pack_${subject}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsed = JSON.parse(data);
    // Remove downloaded_at before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { downloaded_at, ...offlinePack } = parsed;
    return offlinePack as DownloadOfflinePackResponse;
  } catch {
    console.error("Failed to get offline pack");
    return null;
  }
}

/**
 * Check if offline pack exists for a subject
 */
export function hasOfflinePack(subject: SubjectType): boolean {
  try {
    const key = `ogaticha_offline_pack_${subject}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear all offline packs
 */
export function clearAllOfflinePacks(): boolean {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("ogaticha_offline_pack_")) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch {
    console.error("Failed to clear offline packs");
    return false;
  }
}

/**
 * Get size of offline storage in bytes
 */
export function getOfflineStorageSize(): number {
  try {
    let total = 0;
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("ogaticha_offline_pack_")) {
        const item = localStorage.getItem(key);
        if (item) {
          total += item.length * 2; // UTF-16 characters are 2 bytes
        }
      }
    });
    return total;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
