import { useEffect, useState, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { imageService } from '../services/api';
import type { IImage } from '../types/auth.types';
import { showToast } from '../utils/toast';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePhoto } from '../components/SortablePhoto';
import { useAuth } from '../context/AuthContext';

const ImageUpload = lazy(() => import('../components/ImageUpload'));
const ImageEdit = lazy(() => import('../components/ImageEdit'));
const ConfirmModal = lazy(() => import('../components/common/ConfirmModal'));

const Home = () => {
    const [images, setImages] = useState<IImage[]>([]);
    const [showUpload, setShowUpload] = useState(false);
    const [editingImage, setEditingImage] = useState<IImage | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasOrderChanged, setHasOrderChanged] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalImages, setTotalImages] = useState(0);
    const { logout, user } = useAuth();

    const LIMIT = 8;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchImages = useCallback(async (targetPage: number) => {
        const isInitial = targetPage === 1;
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const data = await imageService.getImages(targetPage, LIMIT);

            setImages(prev => {
                const updatedImages = isInitial ? data.images : [...prev, ...data.images];
              
                setHasMore(updatedImages.length < data.total);
                return updatedImages;
            });

            if (isInitial) {
                setPage(1);
            }
            setTotalImages(data.total);
            setHasOrderChanged(false);
        } catch (error) {
            console.error('Failed to fetch images:', error);
            showToast('error', 'Failed to load images');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchImages(1);
    }, [fetchImages]);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchImages(nextPage);
        }
    }, [loadingMore, hasMore, fetchImages, page]);

    const handleInitialFetch = useCallback(() => {
        fetchImages(1);
    }, [fetchImages]);

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading || loadingMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loading, loadingMore, hasMore, loadMore]);

    const handleDelete = useCallback((id: string) => {
        setImageToDelete(id);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!imageToDelete) return;
        try {
            await imageService.delete(imageToDelete);
            setImages(prev => prev.filter((img) => img.imageId !== imageToDelete));
            setTotalImages(prev => Math.max(0, prev - 1));
            showToast('success', 'Image deleted successfully');
        } catch {
            showToast('error', 'Delete failed');
        } finally {
            setImageToDelete(null);
        }
    }, [imageToDelete]);

    const handleEdit = useCallback((image: IImage) => {
        setEditingImage(image);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((i) => i.imageId === active.id);
                const newIndex = items.findIndex((i) => i.imageId === over.id);
                const newArray = arrayMove(items, oldIndex, newIndex);
                setHasOrderChanged(true);
                return newArray;
            });
        }
    }, []);

    const saveOrder = useCallback(async () => {
        try {
            const updates = images.map((img, index) => ({
                imageId: img.imageId,
                order: index
            }));
            await imageService.reorder(updates);
            setHasOrderChanged(false);
            showToast('success', 'Order saved successfully!');
        } catch {
            showToast('error', 'Failed to save order');
        }
    }, [images]);

    const sortableItems = useMemo(() => images.map(img => img.imageId), [images]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Galleria
                        </h1>
                        {!loading && totalImages > 0 && (
                            <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 animate-in fade-in slide-in-from-left-2 duration-500">
                                {totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            {user && (
                                <>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</span>
                                    <span className="text-sm font-bold text-gray-700">{user.username}</span>
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {hasOrderChanged && (
                                <button
                                    onClick={saveOrder}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Order
                                </button>
                            )}
                            <button
                                onClick={() => setShowUpload(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Image
                            </button>
                            <button
                                onClick={logout}
                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
                                title="Logout"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : images.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sortableItems}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {images.map((image) => (
                                    <SortablePhoto
                                        key={image.imageId}
                                        image={image}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-700">No images yet</h2>
                        <p className="text-gray-400 mt-2 max-w-sm mx-auto">Start by uploading some photos to build your personal gallery.</p>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="mt-6 px-8 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Upload First Photo
                        </button>
                    </div>
                )}

                {/* Sentinel for Infinite Scroll */}
                <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                    {loadingMore && (
                        <div className="flex items-center gap-3 text-blue-600 font-medium animate-pulse">
                            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading more magic...</span>
                        </div>
                    )}
                    {!hasMore && images.length > 0 && (
                        <p className="text-gray-400 font-medium italic">You've reached the end of your gallery ✨</p>
                    )}
                </div>
            </main>

            <Suspense fallback={null}>
                {showUpload && (
                    <ImageUpload
                        onUploadSuccess={handleInitialFetch}
                        onClose={() => setShowUpload(false)}
                    />
                )}

                {editingImage && (
                    <ImageEdit
                        image={editingImage}
                        onUpdateSuccess={handleInitialFetch}
                        onClose={() => setEditingImage(null)}
                    />
                )}

                <ConfirmModal
                    isOpen={!!imageToDelete}
                    title="Delete Image"
                    message="Are you sure you want to delete this image? This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={() => setImageToDelete(null)}
                />
            </Suspense>
        </div>
    );
};

export default Home;