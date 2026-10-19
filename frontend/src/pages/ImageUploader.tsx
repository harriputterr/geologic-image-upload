import { useEffect, useRef, useState } from "react";

import { useImageUploader } from "../hooks/useImageUploader";

const PEOPLE = [
  "Alex Morgan",
  "Jordan Lee",
  "Maya Patel",
  "Sofia Garcia",
  "Daniel Kim",
];

type SelectedImage = {
  id: string;
  name: string;
  previewUrl: string;
  people: string[];
};

export default function ImageUploader() {
  const uploadImage = useImageUploader();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [openTagPickerId, setOpenTagPickerId] = useState<string | null>(null);
  const [toast, setToast] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const onSubmit = async (formData: FormData) => {
    formData.set(
      "tags",
      JSON.stringify(
        selectedImages.map((image, fileIndex) => ({
          fileIndex,
          fileName: image.name,
          people: image.people,
        })),
      ),
    );

    try {
      await uploadImage(formData);
      previewUrlsRef.current.forEach(URL.revokeObjectURL);
      previewUrlsRef.current = [];
      setSelectedImages([]);
      setOpenTagPickerId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setToast("success");
    } catch {
      setToast("error");
    }
  };

  const selectFiles = (files: FileList | null) => {
    previewUrlsRef.current.forEach(URL.revokeObjectURL);

    if (!files) {
      previewUrlsRef.current = [];
      setSelectedImages([]);
      return;
    }

    const images = Array.from(files, (file, index) => {
      const previewUrl = URL.createObjectURL(file);

      return {
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        previewUrl,
        people: [],
      };
    });

    previewUrlsRef.current = images.map((image) => image.previewUrl);
    setSelectedImages(images);
    setOpenTagPickerId(null);
  };

  const togglePerson = (imageId: string, person: string) => {
    setSelectedImages((images) =>
      images.map((image) => {
        if (image.id !== imageId) return image;

        const isTagged = image.people.includes(person);
        return {
          ...image,
          people: isTagged
            ? image.people.filter((name) => name !== person)
            : [...image.people, person],
        };
      }),
    );
  };

  return (
    <div className="min-h-svh bg-[#07141c] text-white">
      <header className="flex h-16 items-center bg-black px-8 sm:h-[72px] sm:px-10">
        <p className="text-[15px] font-medium tracking-[0.34em] uppercase">
          Geologic
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl flex-col justify-center px-6 py-12 sm:min-h-[calc(100svh-72px)]">
        <h1 className="mb-8 text-4xl font-normal tracking-tight sm:text-5xl">
          Geologic Image Uploader
        </h1>

        <form
          action={onSubmit}
          className="flex w-full flex-col items-start gap-6 border border-white/40 bg-white/3 px-6 py-10"
        >
          <label htmlFor="image" className="text-lg font-light text-white/85">
            Upload images:
          </label>
          <input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => selectFiles(event.target.files)}
            className="w-full text-sm text-white/75 file:mr-4 file:cursor-pointer file:border file:border-white file:bg-transparent file:px-5 file:py-3 file:text-xs file:font-medium file:tracking-[0.08em] file:text-white file:uppercase hover:file:bg-white hover:file:text-[#07141c]"
          />
          {selectedImages.length > 0 && (
            <div className="grid w-full gap-5 sm:grid-cols-2">
              {selectedImages.map((image) => (
                <article
                  key={image.id}
                  className="border border-white/25 bg-black/20 p-4"
                >
                  <img
                    src={image.previewUrl}
                    alt={`Preview of ${image.name}`}
                    className="aspect-video w-full object-cover"
                  />
                  <p className="mt-3 truncate text-sm text-white/80">
                    {image.name}
                  </p>

                  {image.people.length > 0 && (
                    <p className="mt-2 text-xs text-white/60">
                      Tagged: {image.people.join(", ")}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setOpenTagPickerId((current) =>
                        current === image.id ? null : image.id,
                      )
                    }
                    className="mt-4 cursor-pointer border border-white/60 px-3 py-2 text-xs tracking-[0.08em] uppercase hover:bg-white hover:text-[#07141c]"
                  >
                    Tag people
                  </button>

                  {openTagPickerId === image.id && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {PEOPLE.map((person) => {
                        const isTagged = image.people.includes(person);

                        return (
                          <button
                            key={person}
                            type="button"
                            aria-pressed={isTagged}
                            onClick={() => togglePerson(image.id, person)}
                            className={`cursor-pointer border px-3 py-2 text-xs ${
                              isTagged
                                ? "border-white bg-white text-[#07141c]"
                                : "border-white/30 text-white/75 hover:border-white"
                            }`}
                          >
                            {person}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={selectedImages.length === 0}
            className="cursor-pointer border border-white bg-transparent px-5 py-3 text-xs font-medium tracking-[0.08em] text-white uppercase hover:bg-white hover:text-[#07141c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Upload
          </button>
        </form>
      </main>
      {toast && (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 border border-white bg-black px-5 py-3 text-xs font-medium tracking-[0.08em] text-white uppercase"
        >
          {toast === "success" ? "Images uploaded" : "Upload failed"}
        </p>
      )}
    </div>
  );
}
