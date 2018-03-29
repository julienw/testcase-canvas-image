import processImage from './processImage';

function containFiles(dataTransfer) {
  for (const file of yieldFiles(dataTransfer)) {
    return true;
  }
  return false;
}

function* yieldFiles(dataTransfer) {
  if (dataTransfer.items) {
    for (var item of dataTransfer.items) {
      if (item.kind === "file") {
        yield item.getAsFile();
      }
    }
  } else {
    yield* dataTransfer.files;
  }
}

function appendSideBySide(original, transformed) {
  const result = document.querySelector('.result');
  const img1 = document.createElement('img');
  img1.src = URL.createObjectURL(original);

  const img2 = document.createElement('img');
  img2.src = transformed.thumb;

  const container = document.createElement('div');
  container.className = 'container';

  container.appendChild(img1);
  container.appendChild(img2);
  result.appendChild(container);
}

function displayFilesSideBySide(originals, transformeds) {
  for (let i = 0; i < originals.length; i++) {
    const original = originals[i];
    const transformed = transformeds[i];
    appendSideBySide(original, transformed);
  }
}

const dropElt = document.querySelector('.drop-here');
dropElt.addEventListener('dragenter', e => {
  e.preventDefault();
  if (containFiles(e.dataTransfer)) {
    e.dataTransfer.dropEffect = "copy";
    dropElt.classList.add('dragged-hover');
  } else {
    e.dataTransfer.dropEffect = "none";
  }
});

dropElt.addEventListener('dragleave', e => {
  dropElt.classList.remove('dragged-hover');
});

dropElt.addEventListener('dragover', e => {
  e.preventDefault();
});

dropElt.addEventListener('drop', async e => {
  e.preventDefault();
  dropElt.classList.remove('dragged-hover');

  const originalFiles = Array.from(
    yieldFiles(e.dataTransfer)
  );

  const result = await Promise.all(
    originalFiles.map(processImage)
  );

  displayFilesSideBySide(originalFiles, result);
});
