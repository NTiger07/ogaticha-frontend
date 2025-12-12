/* eslint-disable */
// @ts-nocheck
// QUICK REFERENCE - Copy & Paste Examples
// Note: This file is for reference only and contains example code snippets

// ========================================
// 1. USER REGISTRATION
// ========================================
import { useRegister } from '@/hooks/useAPI';

const { loading, error, register } = useRegister();

const success = await register({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'student',
    disability_type: 'visual',
    preferred_mode: 'audio',
});

// ========================================
// 2. ASK AI (TEXT)
// ========================================
import { useAskAI } from '@/hooks/useAPI';

const { data, loading, error, ask } = useAskAI();

const response = await ask('What is photosynthesis?', 'user_id');
console.log(response?.answer);

// ========================================
// 3. UPLOAD IMAGE NOTE
// ========================================
import { useUploadNote } from '@/hooks/useAPI';

const { data, loading, upload } = useUploadNote();

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const result = await upload(file, 'user_id');
        console.log(result?.transcription);
    }
};

// ========================================
// 4. VOICE COMMAND
// ========================================
import { useVoiceCommand } from '@/hooks/useAPI';
import { recordAudio } from '@/lib/api';

const { data, loading, sendCommand } = useVoiceCommand();

// Record audio
const audioFile = await recordAudio(5000); // 5 seconds

// Send to API
if (audioFile) {
    const result = await sendCommand(audioFile);
    console.log('You said:', result?.user_said);
    console.log('AI response:', result?.ai_text);

    // Play audio response
    const audio = new Audio(result?.ai_audio_url);
    audio.play();
}

// ========================================
// 5. OFFLINE CONTENT
// ========================================
import {
    useOfflinePack,
    saveOfflinePackToStorage,
    getOfflinePackFromStorage
} from '@/lib/api';

const { data, loading, download } = useOfflinePack();

// Download and save
const pack = await download('physics');
if (pack) {
    saveOfflinePackToStorage(pack, 'physics');
}

// Load from storage
const cachedPack = getOfflinePackFromStorage('physics');

// ========================================
// 6. FORM WITH ERROR HANDLING
// ========================================
function MyForm() {
    const { data, loading, error, register } = useRegister();

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            const success = await register({ /* data */ });
            if (success) router.push('/dashboard');
        }}>
            {/* Fields */}

            {error && (
                <div className="error">{error}</div>
            )}

            <button disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </form>
    );
}

// ========================================
// 7. DIRECT API CALLS (WITHOUT HOOKS)
// ========================================
import { askAI, registerUser, uploadNote } from '@/lib/api';

// Registration
const result = await registerUser({ email: 'test@test.com', password: 'pass' });
if (result.success) {
    console.log(result.data.message);
}

// Ask AI
const aiResult = await askAI('What is gravity?');
if (aiResult.success) {
    console.log(aiResult.data.answer);
}

// Upload note
const uploadResult = await uploadNote(fileObject, 'user_id');
if (uploadResult.success) {
    console.log(uploadResult.data.transcription);
}

// ========================================
// 8. CHECK BACKEND STATUS
// ========================================
import { checkHealth, testDatabaseConnection } from '@/lib/api';

const isHealthy = await checkHealth();
const dbTest = await testDatabaseConnection();

// ========================================
// 9. TYPESCRIPT TYPES
// ========================================
import type {
    RegisterRequest,
    AskAIResponse,
    DisabilityType,
    PreferredMode,
    APIResponse,
} from '@/lib/api';

// ========================================
// 10. FILE INPUT COMPONENT
// ========================================
function FileUploader() {
    const { loading, error, upload } = useUploadNote();

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await upload(file);
                }}
                disabled={loading}
            />
            {error && <p className="error">{error}</p>}
        </div>
    );
}
