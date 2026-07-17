document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('watermarkForm');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const uploadPrompt = document.getElementById('uploadPrompt');
  const fileSelected = document.getElementById('fileSelected');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeFileBtn = document.getElementById('removeFileBtn');

  const opacityInput = document.getElementById('opacity');
  const opacityVal = document.getElementById('opacityVal');
  const sizeInput = document.getElementById('size');
  const sizeVal = document.getElementById('sizeVal');

  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  let activeFile = null;

  // Sync range values
  opacityInput.addEventListener('input', (e) => {
    opacityVal.textContent = `${Math.round(e.target.value * 100)}%`;
  });

  sizeInput.addEventListener('input', (e) => {
    sizeVal.textContent = `${e.target.value}px`;
  });

  // Drag and drop event listeners
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('border-teal-500', 'bg-teal-500/5');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-teal-500', 'bg-teal-500/5');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      handleFile(files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    if (!activeFile) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileSelection();
  });

  function handleFile(file) {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast('error', 'Only PDF files are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File size exceeds the 5MB limit.');
      return;
    }

    activeFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    uploadPrompt.classList.add('hidden');
    fileSelected.classList.remove('hidden');
    hideToast();
  }

  function resetFileSelection() {
    activeFile = null;
    fileInput.value = '';
    uploadPrompt.classList.remove('hidden');
    fileSelected.classList.add('hidden');
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function showToast(type, message) {
    toast.classList.remove('hidden', 'bg-rose-500/10', 'border-rose-500/20', 'text-rose-200', 'bg-teal-500/10', 'border-teal-500/20', 'text-teal-200', 'bg-indigo-500/10', 'border-indigo-500/20', 'text-indigo-200');
    
    if (type === 'error') {
      toast.classList.add('bg-rose-500/10', 'border-rose-500/20', 'text-rose-200');
      toastIcon.innerHTML = `
        <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    } else if (type === 'success') {
      toast.classList.add('bg-teal-500/10', 'border-teal-500/20', 'text-teal-200');
      toastIcon.innerHTML = `
        <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    } else { // info/loading
      toast.classList.add('bg-indigo-500/10', 'border-indigo-500/20', 'text-indigo-200');
      toastIcon.innerHTML = `
        <svg class="w-5 h-5 text-indigo-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
        </svg>
      `;
    }
    
    toastMessage.textContent = message;
  }

  function hideToast() {
    toast.classList.add('hidden');
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!activeFile) {
      showToast('error', 'Please select a PDF file first.');
      return;
    }

    const watermarkText = document.getElementById('text').value.trim();
    if (!watermarkText) {
      showToast('error', 'Watermark text cannot be empty.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    showToast('info', 'Processing PDF and applying watermark...');

    const formData = new FormData();
    formData.append('pdf', activeFile);
    formData.append('text', watermarkText);
    formData.append('opacity', opacityInput.value);
    formData.append('size', sizeInput.value);

    try {
      const response = await fetch('/watermark', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply watermark.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${activeFile.name}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      a.remove();

      showToast('success', 'PDF watermarked and downloaded successfully!');
    } catch (error) {
      console.error(error);
      showToast('error', error.message || 'An unexpected error occurred during processing.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  });
});
