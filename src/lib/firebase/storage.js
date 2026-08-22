// src/lib/firebase/storage.js
export async function uploadNewsImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Error al subir");
  return data.secure_url;
}