export const ROOT_FOLDER_ID = 0;

export const NULL_ID = Buffer.alloc(24, '0').toString('utf-8');

export const MAX_FILES_PER_PAGE = 20;

export const VALID_FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};

export const isValidId = (id: string | number): boolean => {
  const size = 24; // mongoDB  ObjectIs is 24 chars long
  let i = 0;
  const charRanges = [
    [48, 57], // 0 - 9
    [97, 102], // a - f
    [65, 70], // A - F
  ]; // Defines valid character ranges for ObjectId (hexadecimal characters).

  if (typeof id !== 'string' || id.length !== size) {
    // Checks if id is a string and has a length of 24 characters.
    return false;
  }

  while (i < size) {
    const c = id[i];
    const code = c.charCodeAt(0);

    if (
      !charRanges.some(
        (range: number[]) => code >= range[0] && code <= range[1]
      )
    ) {
      return false;
    }
    i += 1;
  }
  return true;
};
