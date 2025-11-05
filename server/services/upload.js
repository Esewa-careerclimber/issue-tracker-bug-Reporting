// Helper for deleting files, etc.
import fs from 'fs';

export function deleteFile(path) {
  fs.unlink(path, err => {
    if (err) console.error('Failed to delete file:', err);
  });
}