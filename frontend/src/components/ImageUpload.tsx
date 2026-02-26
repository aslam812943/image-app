import { useState } from 'react';
import { imageService } from '../services/api';
import { showToast } from '../utils/toast';

interface ImageUploadProps {
    onUploadSuccess: () => void;
    onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, onClose }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);
            setTitles((prev) => [...prev, ...filesArray.map(() => '')]);
        }
    };

    const handleTitleChange = (index: number, value: string) => {
        const newTitles = [...titles];
        newTitles[index] = value;
        setTitles(newTitles);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        setTitles(titles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        const hasEmptyTitle = titles.some(title => !title.trim());
        if (hasEmptyTitle) {
            showToast('warning', 'Please enter a title for all selected images.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });
        formData.append('titles', JSON.stringify(titles));

        try {
            await imageService.upload(formData);
            showToast('success', 'Images uploaded successfully!');
            onUploadSuccess();
            onClose();
        } catch (error) {
            showToast('error', 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Upload Images
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-all group">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-gray-600 group-hover:text-blue-600 font-medium">Click to select files</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </label>
                </div>

                <div className="space-y-4 mb-6">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    placeholder="Enter title for this image"
                                    value={titles[index]}
                                    onChange={(e) => handleTitleChange(index, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={() => handleRemoveFile(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors self-center p-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                        className={`px-8 py-2 rounded-lg text-white font-semibold transition-all shadow-lg ${uploading || selectedFiles.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-blue-200'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload All'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
