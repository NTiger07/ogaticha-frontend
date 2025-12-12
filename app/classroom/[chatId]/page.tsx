'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { getCourse, downloadCourseMaterial } from '@/lib/api/courses';
import { askAI } from '@/lib/api/classroom';
import { Course } from '@/lib/types/api';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.chatId as string;
    const { user, token } = useAuthStore();
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const [currentSummary, setCurrentSummary] = useState('');
    const [currentMaterialName, setCurrentMaterialName] = useState('');
    const [isReading, setIsReading] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

    const isLecturer = user?.role === 'lecturer';

    // Initialize speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    // Clean AI response from markdown formatting
    const cleanAIResponse = (text: string): string => {
        return text
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/\*/g, '') // Remove italic markers
            .replace(/#{1,6}\s/g, '') // Remove heading markers
            .replace(/^[-*]\s/gm, '') // Remove list markers
            .replace(/^\d+\.\s/gm, '') // Remove numbered list markers
            .replace(/--/g, '-') // Replace double dashes with single
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
            .trim();
    };

    // Read text aloud using speech synthesis
    const readAloud = (text: string) => {
        if (!speechSynthesis) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);

        speechSynthesis.speak(utterance);
    };

    // Stop reading
    const stopReading = () => {
        if (speechSynthesis) {
            speechSynthesis.cancel();
            setIsReading(false);
        }
    };

    // Clean up speech on unmount or modal close
    useEffect(() => {
        return () => {
            if (speechSynthesis) {
                speechSynthesis.cancel();
            }
        };
    }, [speechSynthesis]);

    // Helper function to get material file name
    const getMaterialFileName = (material: any): string => {
        // Try title field first (backend sends this)
        if (material.title && material.title.trim()) {
            return material.title;
        }

        // Fallback to filename field
        if (material.filename && material.filename.trim()) {
            return material.filename;
        }

        // Try to extract from file_path
        if (material.file_path) {
            const pathParts = material.file_path.split('/');
            const filename = pathParts[pathParts.length - 1];
            return decodeURIComponent(filename);
        }

        // Last resort: use a generic name with the file type
        return `Material.${material.file_type || 'file'}`;
    };

    const loadCourse = async () => {
        setIsLoading(true);
        setError(null);

        const result = await getCourse(courseId, token || undefined);

        if (result.success) {
            setCourse(result.data.course);
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (courseId) {
            loadCourse();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const handleDownloadMaterial = async (materialId: string, materialName: string) => {
        if (!courseId) return;

        try {
            const result = await downloadCourseMaterial(courseId, materialId, token || undefined);

            if (result.success) {
                // Create a blob URL and download
                const blob = result.data;

                // Check if blob has content
                if (blob.size === 0) {
                    alert('Downloaded file is empty');
                    return;
                }

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = materialName || 'download';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Cleanup after a short delay
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);
            } else {
                alert('Failed to download material: ' + result.error);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('An error occurred while downloading: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleSummarizeMaterial = async (materialName: string) => {
        setIsSummarizing(true);
        setCurrentMaterialName(materialName);

        const question = `Please summarize the key points and main concepts from the course material titled "${materialName}". Provide a comprehensive but concise summary that highlights the most important information.`;

        const result = await askAI(question, user?.id);

        if (result.success) {
            // Clean the AI response
            const cleanedSummary = cleanAIResponse(result.data.answer);
            setCurrentSummary(cleanedSummary);
            setSummaryModalOpen(true);

            // Auto-read the summary
            setTimeout(() => {
                readAloud(cleanedSummary);
            }, 500);
        } else {
            alert('Failed to generate summary: ' + result.error);
        }

        setIsSummarizing(false);
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9f506]"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !course) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
                        <p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>
                        <Link
                            href="/classroom"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to Classroom
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8f8f5]">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isDesktopOpen={isDesktopSidebarOpen}
                    onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                />

                <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                    {/* Header */}
                    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden w-10 h-10 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined">menu</span>
                                    </button>
                                    <Link
                                        href="/classroom"
                                        className="w-10 h-10 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </Link>
                                    <div>
                                        <h1 className="text-xl lg:text-3xl font-bold text-[#181811]">{course.title}</h1>
                                        <p className="hidden lg:block text-gray-600 mt-1">{course.description}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/settings"
                                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-gray-600">person</span>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                        {/* Course Info */}
                        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-[#181811] mb-2">{course.title}</h2>
                                    <p className="text-gray-600 mb-4">{course.description}</p>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {!isLecturer && course.lecturer_name && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#f9f506]">person</span>
                                                <span className="font-medium">{course.lecturer_name}</span>
                                            </div>
                                        )}

                                        {isLecturer && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#f9f506]">group</span>
                                                <span className="font-medium">{course.student_emails.length} enrolled students</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#f9f506]">folder</span>
                                            <span className="font-medium">{course.materials.length} materials</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#f9f506]">calendar_today</span>
                                            <span className="font-medium">Created {new Date(course.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enrolled Students (Lecturer View Only) */}
                        {isLecturer && course.student_emails.length > 0 && (
                            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
                                <h3 className="text-xl font-bold text-[#181811] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">group</span>
                                    Enrolled Students ({course.student_emails.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {course.student_emails.map((email, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-[#f9f506] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm text-[#181811]">person</span>
                                            </div>
                                            <span className="text-sm font-medium truncate">{email}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Materials */}
                        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-[#181811] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">folder_open</span>
                                Course Materials
                            </h3>

                            {course.materials.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="material-symbols-outlined text-3xl text-gray-400">folder_off</span>
                                    </div>
                                    <p className="text-gray-600">No materials uploaded yet</p>
                                    {isLecturer && (
                                        <p className="text-sm text-gray-500 mt-1">Upload materials from the course management page</p>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {course.materials.map((material) => (
                                        <div
                                            key={material.id}
                                            className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#f9f506]/50 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-[#f8f8f5] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                                    <span className="material-symbols-outlined text-2xl text-[#f9f506]">
                                                        {material.file_type.includes('pdf') ? 'picture_as_pdf' :
                                                            material.file_type.includes('image') ? 'image' :
                                                                material.file_type.includes('video') ? 'video_file' :
                                                                    'insert_drive_file'}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-[#181811] mb-1 truncate">{getMaterialFileName(material)}</h4>
                                                    <p className="text-xs text-gray-600 mb-3">
                                                        Uploaded {new Date(material.uploaded_at).toLocaleDateString()}
                                                    </p>

                                                    <div className="space-y-2">
                                                        <button
                                                            onClick={() => handleSummarizeMaterial(getMaterialFileName(material))}
                                                            disabled={isSummarizing}
                                                            className="w-full h-9 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors disabled:opacity-50"
                                                        >
                                                            <span className="material-symbols-outlined text-base">auto_awesome</span>
                                                            <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadMaterial(material.id, getMaterialFileName(material))}
                                                            className="w-full h-9 bg-white hover:bg-gray-50 text-[#181811] border-2 border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-base">download</span>
                                                            <span>Download</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Summary Modal */}
                {summaryModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#181811]">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#181811]">AI Summary</h2>
                                        <p className="text-sm text-gray-600">{currentMaterialName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSummaryModalOpen(false)}
                                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                        {currentSummary}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(currentSummary);
                                            alert('Summary copied to clipboard!');
                                        }}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 bg-white rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">content_copy</span>
                                        <span>Copy</span>
                                    </button>
                                    {isReading ? (
                                        <button
                                            onClick={stopReading}
                                            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">stop_circle</span>
                                            <span>Stop Reading</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => readAloud(currentSummary)}
                                            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">volume_up</span>
                                            <span>Read Aloud</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            stopReading();
                                            setSummaryModalOpen(false);
                                        }}
                                        className="flex-1 px-4 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-lg font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
