import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './types/file.types';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadedFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const name = `${Date.now()}-${file.originalname}`;
        await writeFile(`${uploadedFolder}/${name}`, file.buffer);
        return {
          url: `/uploads/${folder}/${name}`,
          name,
        };
      }),
    );

    return response;
  }
}
