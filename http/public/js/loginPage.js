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
            console.log(`${response.cookieName}=${JSON.stringify(response.cookieValue)}; max-age=${response.cookieOptions.maxAge}; secure=${response.cookieOptions.secure}; sameSite=${response.cookieOptions.sameSite}; path=${response.cookieOptions.path}`);
            document.cookie = `${response.cookieName}=${JSON.stringify(response.cookieValue)}; max-age=${response.cookieOptions.maxAge}; secure=${response.cookieOptions.secure}; sameSite=${response.cookieOptions.sameSite}; path=${response.cookieOptions.path}`;
            window.location.href = "/";
        },
        error: function(xhr, status, error) {
          // Handle errors
          alert("Forkert adgangskode");
          console.error(error);
        }
      });
    });
});