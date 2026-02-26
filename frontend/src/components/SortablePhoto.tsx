import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BASE_URL } from '../services/api';

interface Image {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

interface SortablePhotoProps {
    image: Image;
    onDelete: (id: string) => void;
    onEdit?: (image: any) => void;
}

export function SortablePhoto({ image, onDelete, onEdit }: SortablePhotoProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="aspect-[4/3] overflow-hidden cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <img
                    src={`${BASE_URL}${image.imageUrl}`}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/20 backdrop-blur-md rounded-lg">
                            DRAG TO REORDER
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-white relative">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate w-full" title={image.title}>
                        {image.title}
                    </h3>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onEdit && onEdit(image)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(image.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(image.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
