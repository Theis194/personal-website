$(document).ready(function() {
    // Intercept the form submission
    $('#loginForm').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            document.cookie = `${response.cookie.cookieName}=${response.cookie.cookieValue};` +
            `max-age=${response.cookie.cookieOptions.maxAge};`;
            console.log(response);
        },
        error: function(xhr, status, error) {
          // Handle errors
          console.log(xhr.responseText);
          console.error(error);
        }
      });
    });
});