import multer from 'multer';
import fs from 'fs';
import path from 'path';
const fileStorage = multer.diskStorage({
    destination: 'public/files/',
    filename: function (req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    },
});

const videoStorage = multer.diskStorage({
    destination: 'uploads/videos/',
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(webm|mpg|mp2|mpeg|mpe|mpv|ogg|mp4|m4p|m4v|avi|wmv|mov|qt|flv|swf|avchd)$/)) {
            return cb(new Error('Only video files are permitted.'), '');
        }
        const filename = file.originalname;
        cb(null, `${Date.now()}-${filename}`);
    },
});

const fileUpload = multer({ storage: fileStorage, limits: { fileSize: 1000 * 1000 * 1000 } }).single('file');

export async function handleFileUpload(req: any, res: any, name: string) {
    try {
        await new Promise<void>((resolve, reject) => {
            fileUpload(req, res, function (err) {
                if (err) {
                    console.error('File upload error:', err);
                    return reject({ status: false, error: 'File upload failed.' });
                }
                resolve();
            });
        });
        const file_name = `${Date.now()}_${(req as any).user.id}_${name}${path.extname(req.file.originalname)}`;
        renameFile(`${req.file.filename}`, file_name);
        //console.log('Uploaded file:', req.file);
        return { status: true, result: file_name };
    } catch (e) {
        console.error('Error in handleFileUpload:', e);
        return { status: false, error: 'An unexpected error occurred.' };
    }
}

export function deleteFiles(req: any, userId: string, name: string): Promise<{ status: boolean; error?: string }> {
    return new Promise(resolve => {
        fs.readdir('public/files', (readErr, files) => {
            if (readErr) {
                console.error('Error reading directory:', readErr);
                resolve({ status: false, error: 'An unexpected error occurred while reading the directory.' });
                return;
            }

            //console.log(req.file);
            const filesToDelete = files.filter(file =>
                file.endsWith(`${userId}_${name}${path.extname(req.file.originalname)}`),
            );

            Promise.all(
                filesToDelete.map(file => {
                    const filePath = path.join('public/files', file);
                    return new Promise(unlinkResolve => {
                        fs.unlink(filePath, unlinkErr => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr);
                                unlinkResolve(false);
                            } else {
                                //console.log('File deleted:', filePath);
                                unlinkResolve(true);
                            }
                        });
                    });
                }),
            ).then(results => {
                const allDeleted = results.every(result => result);
                if (allDeleted) {
                    resolve({ status: true });
                } else {
                    resolve({ status: false, error: 'Error deleting one or more files.' });
                }
            });
        });
    });
}

export function renameFile(oldPath: string, newPath: string): Promise<{ status: boolean; error?: string }> {
    return new Promise(resolve => {
        fs.rename(`public/files/${oldPath}`, `public/files/${newPath}`, err => {
            if (err) {
                console.error('Error renaming file:', err);
                if (err.code === 'ENOENT') {
                    resolve({ status: false, error: 'File not found.' });
                } else {
                    resolve({ status: false, error: 'An unexpected error occurred while renaming the file.' });
                }
            } else {
                //console.log('File renamed successfully:', newPath);
                resolve({ status: true });
            }
        });
    });
}

const videoUpload = multer({ storage: videoStorage, limits: { fileSize: 1000 * 1000 * 1000 } }).single('file');

export async function handleVideoUpload(req: any, res: any) {
    try {
        await new Promise<void>((resolve, reject) => {
            videoUpload(req, res, function (err) {
                if (err) {
                    console.error('Video upload error:', err);
                    return reject({ status: false, error: 'Video upload failed.' });
                }
                resolve();
            });
        });
        //console.log('Uploaded video:', req.file);
        return { status: true, result: req.file.path };
    } catch (e) {
        //console.log('error req', req);
        console.error('Error in handleVideoUpload:', e);
        return { status: false, error: 'An unexpected error occurred.' };
    }
}

export function deleteVideos(url: string): Promise<{ status: boolean; error?: string }> {
    return new Promise(resolve => {
        fs.readdir('uploads/videos', (readErr, files) => {
            if (readErr) {
                console.error('Error reading directory:', readErr);
                resolve({ status: false, error: 'An unexpected error occurred while reading the directory.' });
                return;
            }

            const filesToDelete = files.filter(file => url.endsWith(file));
            Promise.all(
                filesToDelete.map(file => {
                    const filePath = path.join('uploads/videos', file);
                    return new Promise(unlinkResolve => {
                        fs.unlink(filePath, unlinkErr => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr);
                                unlinkResolve(false);
                            } else {
                                //console.log('File deleted:', filePath);
                                unlinkResolve(true);
                            }
                        });
                    });
                }),
            ).then(results => {
                const allDeleted = results.every(result => result);
                if (allDeleted) {
                    resolve({ status: true });
                } else {
                    resolve({ status: false, error: 'Error deleting one or more files.' });
                }
            });
        });
    });
}
