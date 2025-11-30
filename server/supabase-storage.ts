import { supabaseAdmin } from "./supabase";
import { nanoid } from "nanoid";

/**
 * Upload a file to Supabase Storage
 * @param bucket - The bucket name (e.g., 'avatars', 'documents', 'videos')
 * @param file - File buffer or data
 * @param fileName - Original file name
 * @param contentType - MIME type of the file
 * @returns Object with file path and public URL
 */
export async function uploadFile(
  bucket: string,
  file: Buffer | Uint8Array,
  fileName: string,
  contentType: string
): Promise<{ path: string; url: string }> {
  // Generate unique file path
  const fileExt = fileName.split('.').pop();
  const uniqueId = nanoid(10);
  const filePath = `${uniqueId}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The bucket name
 * @param filePath - Path to the file in the bucket
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get a signed URL for a private file
 * @param bucket - The bucket name
 * @param filePath - Path to the file in the bucket
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL
 */
export async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * List files in a bucket
 * @param bucket - The bucket name
 * @param path - Optional path prefix to filter files
 * @returns Array of file objects
 */
export async function listFiles(
  bucket: string,
  path: string = ""
): Promise<any[]> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data || [];
}

/**
 * Ensure a bucket exists, create if it doesn't
 * @param bucketName - Name of the bucket
 * @param isPublic - Whether the bucket should be public (default: true)
 */
export async function ensureBucket(
  bucketName: string,
  isPublic: boolean = true
): Promise<void> {
  // Check if bucket exists
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === bucketName);

  if (!bucketExists) {
    // Create bucket
    const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: 52428800, // 50MB
    });

    if (error) {
      throw new Error(`Failed to create bucket: ${error.message}`);
    }

    console.log(`[Storage] Created bucket: ${bucketName}`);
  }
}

// Initialize buckets on module load
(async () => {
  try {
    await ensureBucket('avatars', true);
    await ensureBucket('documents', true);
    await ensureBucket('videos', true);
    console.log('[Storage] All buckets initialized');
  } catch (error) {
    console.error('[Storage] Failed to initialize buckets:', error);
  }
})();
