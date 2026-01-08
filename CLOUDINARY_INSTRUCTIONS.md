# How to Fix Image Uploads (Step-by-Step)

You need a free **Cloudinary** account to handle image uploads. Follow these exact steps:

## Step 1: Get Your Cloud Name
1.  Go to [Cloudinary.com](https://cloudinary.com/) and sign up/login.
2.  On the main **Dashboard** page, look for **"Cloud Name"** in the "Product Environment Credentials" section.
3.  Copy that name (e.g., `dyho23abc`).

## Step 2: Configure Your Environment
1.  Open the file named `.env.local` in your project root (create it if it doesn't exist).
2.  Add this line (replace `your_cloud_name_here` with the name you copied):
    ```env
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
    ```

## Step 3: Create the Upload Preset (CRITICAL)
This is the part most people miss.
1.  In Cloudinary, click the **Settings (Gear Icon)** at the top right.
2.  Click on the **"Upload"** tab on the left sidebar.
3.  Scroll down to the **"Upload presets"** section.
4.  Click **"Add upload preset"**.
5.  **Configure exactly like this:**
    *   **Upload preset name**: `unsigned_preset`  (Must be exact!)
    *   **Signing Mode**: Select **"Unsigned"** (This is crucial).
6.  Click **Save**.

## Step 4: Restart
1.  Stop your running server (Ctrl+C).
2.  Run `npm run dev` again.
3.  Try uploading an image on the "Add Product" page.
