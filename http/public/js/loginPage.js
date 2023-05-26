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
            if (typeof response === "object") {
                console.log(response); // This is where alerting the user with what was wrong needs to go
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