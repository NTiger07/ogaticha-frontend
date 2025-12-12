'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useClassroomStore } from '@/lib/store/classroomStore';
import { getCourses, createCourse, addStudentsToCourse, uploadCourseMaterial, deleteCourse } from '@/lib/api/courses';
import { Course } from '@/lib/types/api';

export default function ClassroomPage() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, isAuthenticated, token } = useAuthStore();
    const { courses, setCourses, addCourse, removeCourse, isLoading, setLoading, error, setError, clearError } = useClassroomStore();

    // Modal states
    const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
    const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
    const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
    const [selectedCourseForAction, setSelectedCourseForAction] = useState<Course | null>(null);

    // Form states
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newCourseStudentEmails, setNewCourseStudentEmails] = useState('');
    const [newCourseMaterials, setNewCourseMaterials] = useState<FileList | null>(null);
    const [studentEmails, setStudentEmails] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const loadCourses = async () => {
        if (!user?.id) return;

        setLoading(true);
        clearError();

        const result = await getCourses(
            user.id,
            user.role,
            token || undefined
        );

        if (result.success) {
            setCourses(result.data.courses);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // Load courses on mount
    useEffect(() => {
        if (user?.id) {
            loadCourses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id || !newCourseTitle.trim()) return;

        setLoading(true);
        clearError();

        // Step 1: Create the course
        const result = await createCourse(
            {
                title: newCourseTitle,
                description: newCourseDescription,
                lecturer_id: user.id,
            },
            token || undefined
        );

        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        const createdCourse = result.data.course;

        // Step 2: Add students if emails were provided
        if (newCourseStudentEmails.trim()) {
            const emails = newCourseStudentEmails.split(',').map(email => email.trim()).filter(email => email);
            if (emails.length > 0) {
                const addStudentsResult = await addStudentsToCourse(
                    createdCourse.id,
                    emails,
                    token || undefined
                );
                if (!addStudentsResult.success) {
                    setError('Course created but failed to add students: ' + addStudentsResult.error);
                }
            }
        }

        // Step 3: Upload materials if files were selected
        if (newCourseMaterials && newCourseMaterials.length > 0) {
            for (let i = 0; i < newCourseMaterials.length; i++) {
                const file = newCourseMaterials[i];
                const uploadResult = await uploadCourseMaterial(
                    createdCourse.id,
                    file,
                    token || undefined
                );
                if (!uploadResult.success) {
                    setError(`Course created but failed to upload ${file.name}: ${uploadResult.error}`);
                    break;
                }
            }
        }

        // Reload courses to get updated data
        await loadCourses();
        
        // Close modal and reset form
        setIsCreateCourseModalOpen(false);
        setNewCourseTitle('');
        setNewCourseDescription('');
        setNewCourseStudentEmails('');
        setNewCourseMaterials(null);
        setLoading(false);
    };

    const handleAddStudents = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCourseForAction?.id || !studentEmails.trim()) return;

        setLoading(true);
        clearError();

        const emails = studentEmails.split(',').map(email => email.trim()).filter(email => email);

        const result = await addStudentsToCourse(
            selectedCourseForAction.id,
            emails,
            token || undefined
        );

        if (result.success) {
            await loadCourses(); // Reload to get updated course
            setIsAddStudentsModalOpen(false);
            setStudentEmails('');
            setSelectedCourseForAction(null);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleUploadMaterial = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCourseForAction?.id || !uploadFile) return;

        setLoading(true);
        clearError();

        const result = await uploadCourseMaterial(
            selectedCourseForAction.id,
            uploadFile,
            token || undefined
        );

        if (result.success) {
            await loadCourses(); // Reload to get updated course with material
            setIsUploadMaterialModalOpen(false);
            setUploadFile(null);
            setSelectedCourseForAction(null);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        setLoading(true);
        clearError();

        const result = await deleteCourse(courseId, token || undefined);

        if (result.success) {
            removeCourse(courseId);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const openAddStudentsModal = (course: Course) => {
        setSelectedCourseForAction(course);
        setIsAddStudentsModalOpen(true);
    };

    const openUploadMaterialModal = (course: Course) => {
        setSelectedCourseForAction(course);
        setIsUploadMaterialModalOpen(true);
    };

    const isLecturer = user?.role === 'lecturer';

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8f8f5]">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

                <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                        <span className="material-symbols-outlined">menu</span>
                                    </button>
                                    <div className="lg:hidden w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl text-[#181811]">school</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-4xl font-bold text-[#181811]">
                                            {isAuthenticated && user ? `Welcome back, ${user.name}` : 'Classroom'}
                                        </h1>
                                        <p className="hidden lg:block text-gray-600 mt-1">
                                            {isLecturer ? 'Manage your courses and students' : 'Access your enrolled courses'}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/settings" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-600">person</span>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                                <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-6 lg:mb-8">
                            <h2 className="text-xl lg:text-2xl font-bold text-[#181811]">
                                {isLecturer ? 'My Courses' : 'Enrolled Courses'}
                            </h2>
                            {isLecturer && (
                                <button
                                    onClick={() => setIsCreateCourseModalOpen(true)}
                                    className="px-4 py-2 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    <span>Create Course</span>
                                </button>
                            )}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9f506]"></div>
                            </div>
                        )}

                        {/* Courses Grid */}
                        {!isLoading && courses.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl text-gray-400">school</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    {isLecturer ? 'No courses yet' : 'Not enrolled in any courses'}
                                </h3>
                                <p className="text-gray-600">
                                    {isLecturer ? 'Create your first course to get started' : 'Your enrolled courses will appear here'}
                                </p>
                            </div>
                        )}

                        {!isLoading && courses.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                {courses.map((course) => (
                                    <article key={course.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[#f9f506]/50 transition-all group">
                                        <div className="flex flex-col h-full">
                                            <div className="mb-4">
                                                <h3 className="text-lg lg:text-xl font-bold leading-tight text-[#181811] mb-2">{course.title}</h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                                                {!isLecturer && course.lecturer_name && (
                                                    <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-gray-600">
                                                        <span className="material-symbols-outlined text-sm">person</span>
                                                        <span>{course.lecturer_name}</span>
                                                    </div>
                                                )}

                                                {isLecturer && (
                                                    <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-gray-600">
                                                        <span className="material-symbols-outlined text-sm">group</span>
                                                        <span>{course.student_emails?.length || 0} students</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto space-y-2">
                                                {course.materials?.length > 0 && (
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        <span className="material-symbols-outlined text-sm align-middle">folder</span>
                                                        <span className="align-middle ml-1">{course.materials.length} materials</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/classroom/${course.id}`}
                                                        className="flex-1 h-10 lg:h-12 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-full flex items-center justify-center gap-2 font-bold text-sm lg:text-base transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg lg:text-xl">open_in_new</span>
                                                        <span>Open</span>
                                                    </Link>

                                                    {isLecturer && (
                                                        <div className="relative">
                                                            <button
                                                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-[#181811] hover:bg-gray-100 transition-colors"
                                                                onClick={(e) => {
                                                                    e.currentTarget.nextElementSibling?.classList.toggle('hidden');
                                                                }}
                                                            >
                                                                <span className="material-symbols-outlined">more_vert</span>
                                                            </button>

                                                            <div className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                                <button
                                                                    onClick={() => openAddStudentsModal(course)}
                                                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">person_add</span>
                                                                    Add Students
                                                                </button>
                                                                <button
                                                                    onClick={() => openUploadMaterialModal(course)}
                                                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">upload_file</span>
                                                                    Upload Material
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCourse(course.id)}
                                                                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                    Delete Course
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Create Course Modal */}
                {isCreateCourseModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#181811]">Create New Course</h2>
                                <button onClick={() => setIsCreateCourseModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleCreateCourse}>
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title *</label>
                                        <input
                                            type="text"
                                            value={newCourseTitle}
                                            onChange={(e) => setNewCourseTitle(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none"
                                            placeholder="e.g., Introduction to Web Development"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={newCourseDescription}
                                            onChange={(e) => setNewCourseDescription(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none min-h-[80px]"
                                            placeholder="Describe what students will learn..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Student Emails (Optional)</label>
                                        <textarea
                                            value={newCourseStudentEmails}
                                            onChange={(e) => setNewCourseStudentEmails(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none min-h-[80px]"
                                            placeholder="student1@email.com, student2@email.com"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Course Materials (Optional)</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => setNewCourseMaterials(e.target.files)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Max 10MB per file. Hold Ctrl/Cmd to select multiple files</p>
                                        {newCourseMaterials && newCourseMaterials.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {Array.from(newCourseMaterials).map((file, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                        <span className="material-symbols-outlined text-sm text-[#f9f506]">insert_drive_file</span>
                                                        <span className="flex-1 truncate">{file.name}</span>
                                                        <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateCourseModalOpen(false)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Course'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Students Modal */}
                {isAddStudentsModalOpen && selectedCourseForAction && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#181811]">Add Students</h2>
                                <button onClick={() => setIsAddStudentsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">Adding students to: <strong>{selectedCourseForAction.title}</strong></p>

                            <form onSubmit={handleAddStudents}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Student Emails *</label>
                                        <textarea
                                            value={studentEmails}
                                            onChange={(e) => setStudentEmails(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none min-h-[120px]"
                                            placeholder="Enter email addresses separated by commas&#10;e.g., student1@email.com, student2@email.com"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddStudentsModalOpen(false)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Adding...' : 'Add Students'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Upload Material Modal */}
                {isUploadMaterialModalOpen && selectedCourseForAction && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#181811]">Upload Material</h2>
                                <button onClick={() => setIsUploadMaterialModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">Uploading to: <strong>{selectedCourseForAction.title}</strong></p>

                            <form onSubmit={handleUploadMaterial}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select File *</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f9f506] focus:outline-none"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                                    </div>

                                    {uploadFile && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#f9f506]">insert_drive_file</span>
                                                <span className="text-sm font-medium">{uploadFile.name}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadMaterialModalOpen(false)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
