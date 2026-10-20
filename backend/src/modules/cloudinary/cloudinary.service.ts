import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  /**
   * Upload a Multer file buffer to Cloudinary.
   * @param file   - Express.Multer.File object
   * @param folder - Target Cloudinary folder
   * @returns { url, publicId }
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; publicId: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Geçersiz dosya: buffer bulunamadı.');
    }
    return this.uploadBuffer(file.buffer, folder, file.originalname);
  }

  /**
   * Upload a raw Buffer to Cloudinary via upload_stream.
   * @param buffer   - Raw binary buffer
   * @param folder   - Target Cloudinary folder
   * @param filename - Optional public_id hint (extension stripped)
   * @returns { url, publicId }
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename?: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      // Derive a sanitised public_id from the filename if provided
      const publicIdBase = filename
        ? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
        : undefined;

      const uploadOptions: Record<string, unknown> = {
        folder,
        resource_type: 'auto',
      };

      if (publicIdBase) {
        uploadOptions.public_id = publicIdBase;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(
              new BadRequestException(
                `Cloudinary yükleme hatası: ${error.message}`,
              ),
            );
          }
          if (!result) {
            return reject(
              new BadRequestException('Cloudinary sonuç dönmedi.'),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete an asset from Cloudinary by its public_id.
   * @param publicId - Cloudinary public_id of the asset
   * @returns Cloudinary deletion result
   */
  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
      return { result: result.result };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Bilinmeyen hata';
      throw new BadRequestException(
        `Cloudinary silme hatası: ${message}`,
      );
    }
  }
}
