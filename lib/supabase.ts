import { createClient } from "@supabase/supabase-js";

// Supabase client for client-side operations (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase admin client for server-side operations (uses service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Storage bucket name for equipment images
export const EQUIPMENT_IMAGES_BUCKET = "equipment-images";

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'equipment/image.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(EQUIPMENT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage
    .from(EQUIPMENT_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param path - The storage path to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(EQUIPMENT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Extract the storage path from a public URL
 * @param url - The public URL
 * @returns The storage path
 */
export function getPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf(EQUIPMENT_IMAGES_BUCKET);

    if (bucketIndex === -1) return null;

    return pathParts.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
}
