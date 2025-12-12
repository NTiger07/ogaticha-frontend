import { create } from "zustand";
import { Course } from "../types/api";

interface ClassroomState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  removeCourse: (courseId: string) => void;
  setSelectedCourse: (course: Course | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useClassroomStore = create<ClassroomState>((set) => ({
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  setCourses: (courses) => set({ courses }),

  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses, course],
    })),

  updateCourse: (courseId, updates) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === courseId ? { ...course, ...updates } : course
      ),
      selectedCourse:
        state.selectedCourse?.id === courseId
          ? { ...state.selectedCourse, ...updates }
          : state.selectedCourse,
    })),

  removeCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== courseId),
      selectedCourse:
        state.selectedCourse?.id === courseId ? null : state.selectedCourse,
    })),

  setSelectedCourse: (course) => set({ selectedCourse: course }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
