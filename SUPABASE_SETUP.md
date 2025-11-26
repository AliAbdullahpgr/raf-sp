# Supabase Storage Setup Guide

This guide will help you configure Supabase Storage for the RAF-SP platform's image upload functionality.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your project's environment variables configured

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - Name: `raf-sp-platform` (or your preferred name)
   - Database Password: (generate a secure password)
   - Region: Choose the closest to your users
4. Click "Create new project"

## Step 2: Create Storage Bucket

1. In your Supabase dashboard, navigate to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Configure the bucket:
   - Name: `equipment-images`
   - Public bucket: **Yes** (check this box)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp, image/gif`
4. Click "Create bucket"

## Step 3: Configure Bucket Policies

The bucket should be public for reading, but only authenticated users can upload.

1. Click on the `equipment-images` bucket
2. Go to "Policies" tab
3. Add the following policies:

### Policy 1: Public Read Access

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'equipment-images');
```

### Policy 2: Authenticated Upload

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'equipment-images');
```

### Policy 3: Authenticated Delete (for cleanup)

```sql
CREATE POLICY "Authenticated users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'equipment-images');
```

## Step 4: Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 5: Update Environment Variables

Update your `.env.local` file with the credentials:

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

⚠️ **Important**: Never commit the `.env.local` file to version control!

## Step 6: Test the Upload

1. Start your development server: `npm run dev`
2. Log in to the application
3. Navigate to the equipment inventory page
4. Click "Add Equipment"
5. Try uploading an image using the drag-and-drop interface
6. Verify the image appears in the preview
7. Save the equipment and check that the image displays correctly

## Troubleshooting

### Upload fails with "Unauthorized"

- Check that your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify the bucket policies are configured correctly

### Image doesn't display after upload

- Check that the bucket is set to **Public**
- Verify the public URL is being returned correctly
- Check browser console for CORS errors

### File size errors

- Ensure files are under 5MB
- Check that the bucket file size limit is configured correctly

### Invalid file type errors

- Only image files are allowed (JPEG, PNG, WebP, GIF)
- Check the MIME type of the file you're uploading

## Additional Configuration (Optional)

### Enable Image Transformations

Supabase supports automatic image transformations. To enable:

1. Go to **Storage** → **Settings**
2. Enable "Image transformations"
3. You can then request resized images by adding query parameters:
   ```
   https://your-project.supabase.co/storage/v1/object/public/equipment-images/image.jpg?width=400&height=300
   ```

### Set up CDN Caching

For better performance, configure CDN caching:

1. Go to **Storage** → **Settings**
2. Set cache control headers (default is 3600 seconds)
3. Consider using a custom domain for better caching

## Security Best Practices

1. **Never expose service_role key**: Only use it server-side
2. **Validate file types**: The API route validates MIME types
3. **Limit file sizes**: Currently set to 5MB maximum
4. **Use signed URLs**: For sensitive content (not needed for public equipment images)
5. **Regular cleanup**: Consider implementing a cleanup job for orphaned images

## Next Steps

Once Supabase is configured, the image upload feature is fully functional:

- ✅ Users can upload images via drag-and-drop or file picker
- ✅ Images are validated for type and size
- ✅ Images are stored in Supabase Storage
- ✅ Public URLs are returned and stored in the database
- ✅ Images display in equipment forms and detail pages

For more information, visit the [Supabase Storage Documentation](https://supabase.com/docs/guides/storage).
