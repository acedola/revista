const form = document.getElementById("formulario");
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const fileLabel = document.getElementById("fileLabel");
const messageBox = document.getElementById("formMessage");

dropArea.addEventListener("click", () => fileInput.click());
import {useDropzone} from "react-dropzone"

const {getRootProps,getInputProps} = useDropzone({

accept:{
"application/pdf":[".pdf"]
}


})
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileLabel.textContent = fileInput.files[0].name;
  }
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#009999";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#d8d8d8";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  fileLabel.textContent = fileInput.files[0].name;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageBox.textContent = "";
  messageBox.className = "form-message";

  const formData = new FormData(form);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    messageBox.textContent = "Formulario enviado correctamente.";
    messageBox.classList.add("success");
    form.reset();
    fileLabel.textContent = "Adjunto";

  } catch (error) {
    messageBox.textContent = error.message;
    messageBox.classList.add("error");
  }
});