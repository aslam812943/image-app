
export const getPublicIdFromUrl = (url: string): string | null => {
    if (!url) return null;

    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;


    let startIndex = uploadIndex + 1;
    const versionPart = parts[startIndex];
    if (versionPart && versionPart.startsWith('v') && /^\d+$/.test(versionPart.substring(1))) {
        startIndex++;
    }

    const publicIdWithExt = parts.slice(startIndex).join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');

    if (lastDotIndex === -1) return publicIdWithExt;
    return publicIdWithExt.substring(0, lastDotIndex);
};
