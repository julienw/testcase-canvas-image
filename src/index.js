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
  const result = await Promise.all(
    Array.from(
      yieldFiles(e.dataTransfer)
    ).map(processImage)
  );
  console.log(result);
});
