import React, { useState } from 'react';
import { imageService, BASE_URL } from '../services/api';
import { showToast } from '../utils/toast';

interface Image {
    id: string;
    title: string;
    imageUrl: string;
}

interface ImageEditProps {
    image: Image;
    onUpdateSuccess: () => void;
    onClose: () => void;
}

const ImageEdit: React.FC<ImageEditProps> = ({ image, onUpdateSuccess, onClose }) => {
    const [title, setTitle] = useState(image.title);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(`${BASE_URL}${image.imageUrl}`);
    const [updating, setUpdating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            showToast('warning', 'Please enter a title');
            return;
        }

        setUpdating(true);
        const formData = new FormData();
        formData.append('title', title);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            await imageService.update(image.id, formData);
            showToast('success', 'Changes saved successfully!');
            onUpdateSuccess();
            onClose();
        } catch (error) {
            showToast('error', 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Photo</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Photo Preview</label>
                        <div className="relative group aspect-video rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-white font-bold px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">Replace Image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 font-medium"
                            placeholder="Enter photo title..."
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                    >
                        {updating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </div>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEdit;
