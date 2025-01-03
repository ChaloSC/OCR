import { useState } from "react";
import { createWorker } from "tesseract.js";

const OCRComponent = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const SUPPORTED_FORMATS = [
    "png",
    "jpeg",
    "jpg",
    "tiff",
    "jp2",
    "gif",
    "webp",
    "bmp",
    "pnm",
  ];

  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const extension = file.name
        .slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        .toLowerCase();

      // Validar el formato del archivo
      if (SUPPORTED_FORMATS.includes(extension)) {
        setImage(URL.createObjectURL(file));
        setError(null); // Limpiar cualquier error previo
        console.log(`Formato soportado: ${extension}`);
      } else {
        setImage(null);
        setImage(null);
        setError(`Formato no soportado: ${extension}`);
        console.error(`Formato no soportado: ${extension}`);
      }
    }
  };

  const performOCR = async () => {
    const worker = await createWorker();
    if (!image) return alert("Por favor, selecciona una imagen primero.");

    setText("Procesando...");
    const {
      data: { text },
    } = await worker.recognize(image);
    console.log(text);
    setText(text);
    await worker.terminate();
  };

  return (
    <div className="flex flex-col">
      <h1>{error && <span className="text-xl font-bold text-red-500">{error}</span>}</h1>
      <h1 className="text-lg font-bold">OCR con Tesseract.js</h1>
      <div className="flex flex-col items-center mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
      </div>
      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="mb-4 max-w-[600px] max-h-[400px]"
        />
      )}
      <button
        onClick={performOCR}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Extraer texto
      </button>
      {text && (
        <textarea
          className="w-full h-40 mt-4 p-2 border"
          value={text}
          readOnly
        />
      )}
    </div>
  );
};

export default OCRComponent;
