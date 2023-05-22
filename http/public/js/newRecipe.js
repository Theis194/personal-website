let textareas = []
textareas.push(document.getElementById("ingredients"));
textareas.push(document.getElementById("description"));

textareas.forEach(textarea => {
    textarea.oninput = function() {
        textarea.style.height = "";
        textarea.style.height = textarea.scrollHeight + "px"
      };
});

$(document).ready(function() {
    // Intercept the form submission
    $('#recipeForm').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            if (typeof response === "object") {
                console.log(response);
                return false;
            }
            window.location.href = response;
        },
        error: function(xhr, status, error) {
          // Handle errors
          console.error(error);
        }
      });
    });
});
  
  
  
  
  
  