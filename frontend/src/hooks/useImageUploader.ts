export const useImageUploader = () => {
  const uploadImage = async (data: FormData) => {
    const res = await fetch("http://localhost:3000/api/image/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw Error("An unexpected error happened");
  };

  return uploadImage;
};
