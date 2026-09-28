export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Unable to create the PNG image.'))),
            'image/png'
        );
    });
}

export async function copyCanvas(canvas: HTMLCanvasElement): Promise<void> {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
        throw new Error('Image copy is unavailable in this browser. Use Save to download a PNG.');
    }
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': canvasBlob(canvas) })]);
}

/** Local time as `YYYYMMDD_HHMMSS`, the format the app has always used for exported files. */
export function timestampForFilename(date: Date = new Date()): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    return (
        `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
        `_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
    );
}

export async function saveCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
    const blob = await canvasBlob(canvas);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${timestampForFilename()}.png`;
    link.click();
    // Give the browser time to start the download before releasing the backing blob.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
