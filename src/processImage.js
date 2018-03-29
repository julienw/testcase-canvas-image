import loadImage from "blueimp-load-image"

export default async function processImage(file) {
  const loadImagePromise = new Promise(resolve => {
    loadImage(
      file,
      (canvas, metadata) =>
        resolve({ canvas, metadata }),
      {
        canvas: true,
        // maxWidth: 400,
        maxHeight: 300,
        orientation: true,
        meta: true,
      },
    )
  })

  const { canvas, metadata } = await loadImagePromise

  if (!canvas) {
    return { type: "error" }
  }

  if ("type" in canvas) {
    if (canvas.type === "error") return { type: "error" }
  }

  return {
    type: "image",
    thumb: canvas.toDataURL(file.type, 0.9),
    thumb_width: canvas.width,
    thumb_height: canvas.height,
  }
}
