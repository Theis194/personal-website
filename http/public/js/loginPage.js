$(document).ready(function() {
    // Intercept the form submission
    $('#loginForm').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'GET',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            document.cookie = `${response.cookieName}=${response.cookieValue};` +
            `max-age=${response.cookieOptions.maxAge};`; // Cookie not working ;(
            console.log(response);
            window.location.href = "/";
        },
        error: function(xhr, status, error) {
          // Handle errors
          console.log(xhr.responseText);
          console.error(error);
        }
      });
    });
});