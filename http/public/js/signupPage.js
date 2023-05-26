$(document).ready(function() {
    // Intercept the form submission
    $('#signupForm').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            document.cookie = `${response.cookieName}=${response.cookieValue};` +
            `max-age=${response.cookieOptions.maxAge};`;
            window.location.href = "/";
        },
        error: function(xhr, status, error) {
          // Handle errors
          if (JSON.parse(xhr.responseText) === "userExists") {
            alert("En bruger med den indtastede Email eksistere allerede");
          } else if (JSON.parse(xhr.responseText) === "invalidEmail") {
            alert("Emailen eksistere ikke");
          }
          console.error(error);
        }
      });
    });
});