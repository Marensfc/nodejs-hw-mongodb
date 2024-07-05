import fs from 'fs/promises';

export const createDirIfNotExist = async (file) => {
  try {
    await fs.access(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.mkdir(file);
    }
  }
};
