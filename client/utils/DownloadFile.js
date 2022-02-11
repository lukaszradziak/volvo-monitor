const DownloadFile = (content, filename, contentType = `text/plain`) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  const element = document.createElement("a");
  element.href = url;
  element.setAttribute("download", filename);
  element.click();
};

export default DownloadFile;
