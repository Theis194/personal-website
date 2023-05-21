let textareas = []
textareas.push(document.getElementById("ingredients"));
textareas.push(document.getElementById("description"));

textareas.forEach(textarea => {
    textarea.oninput = function() {
        textarea.style.height = "";
        textarea.style.height = textarea.scrollHeight + "px"
      };
})