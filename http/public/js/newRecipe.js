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

      let user =JSON.parse(JSON.parse(getCookie("currentUser")));
  
      // Send an AJAX request
      $.ajax({
        type: 'POST',
        url: `${$(this).attr('action')}&${currentUserCookie.firstName + " " + currentUserCookie.lastName}`,
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

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();

       if (cookie.indexOf(name) === 0) {
          let cookieValue = cookie.substring(name.length);
          return cookieValue;
      }
  }
  return null; // Return null if the cookie is not found
}