document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const showBboxCheckbox = document.getElementById('show-bbox');
    const showLabelsCheckbox = document.getElementById('show-labels');
    const confidenceSlider = document.getElementById('confidence-slider');
    const classFilters = document.querySelectorAll('.class-filter');
    const showJsonCheckbox = document.getElementById('show-json');
    const jsonOutput = document.getElementById('json-output');

    let detectionResults = null;
    let originalImage = null; // We'll store the loaded image here

    // Function to draw the image and (optionally) bounding boxes and labels
    function drawImageWithAnnotations() {
        if (!originalImage) return;
        // Draw the original image first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        // If showBbox not checked, just show the image and return
        if (!showBboxCheckbox.checked || !detectionResults) return;

        const confidenceThreshold = parseFloat(confidenceSlider.value);

        detectionResults.objects.forEach(object => {
            const classId = object.class_id;
            let isClassSelected = false;
            classFilters.forEach(filter => {
                if (parseInt(filter.dataset.classId, 10) === classId && filter.checked) {
                    isClassSelected = true;
                }
            });

            if (object.confidence >= confidenceThreshold && isClassSelected) {
                const [x, y, x2, y2] = object.bbox;

                // Draw bounding box
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, x2 - x, y2 - y);

                // Draw label if showLabels is checked
                if (showLabelsCheckbox.checked) {
                    ctx.fillStyle = 'red';
                    ctx.font = '16px Arial';
                    ctx.fillText(`${object.class_name} (${object.confidence.toFixed(2)})`, x, Math.max(y - 5, 20));
                }
            }
        });
    }

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            detectionResults = await response.json();

            // Load the original image (the one uploaded) into an Image object
            const imageFile = formData.get('file');
            const imageURL = URL.createObjectURL(imageFile);
            originalImage = new Image();
            originalImage.onload = () => {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                drawImageWithAnnotations();
            };
            originalImage.src = imageURL;

            // Reveal controls and JSON area now that we have results
            document.querySelector('.controls').classList.remove('hidden');
            document.querySelector('.json-area').classList.remove('hidden');

            // If show-json is checked, show JSON
            if (showJsonCheckbox.checked) {
                jsonOutput.textContent = JSON.stringify(detectionResults, null, 2);
            } else {
                jsonOutput.textContent = '';
            }

        } else {
            console.error('Error during detection:', response.statusText);
        }
    });

    // Event listeners for controls
    showBboxCheckbox.addEventListener('change', () => {
        // Toggle visibility of label, slider, and classes only if show bbox is checked
        const show = showBboxCheckbox.checked;
        document.querySelector('.hidden-label-option').classList.toggle('hidden', !show);
        document.querySelector('.hidden-confidence').classList.toggle('hidden', !show);
        document.querySelector('.hidden-classes').classList.toggle('hidden', !show);
        drawImageWithAnnotations();
    });

    showLabelsCheckbox.addEventListener('change', drawImageWithAnnotations);
    confidenceSlider.addEventListener('input', drawImageWithAnnotations);
    classFilters.forEach(filter => filter.addEventListener('change', drawImageWithAnnotations));

    showJsonCheckbox.addEventListener('change', () => {
        if (showJsonCheckbox.checked && detectionResults) {
            jsonOutput.textContent = JSON.stringify(detectionResults, null, 2);
        } else {
            jsonOutput.textContent = '';
        }
    });
});
