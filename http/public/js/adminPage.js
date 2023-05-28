function insertUserData(user) {
    let updateUser = document.getElementById("updateUser");

    updateUser.querySelector("#fName").value = user.fName;
    updateUser.querySelector("#lName").value = user.lName;
    updateUser.querySelector("#emailU").value = user.email;
    updateUser.querySelector("#privileges").value = "";
    for (let i = 0; i < user.privileges.length; i++) {
        if (i+1 == user.privileges.length) {
            updateUser.querySelector("#privileges").value += `${user.privileges[i]}`;
            break;
        }
        updateUser.querySelector("#privileges").value += `${user.privileges[i]}, `;
    }
}

$(document).ready(function() {
    // Intercept the form submission
    $('#getUser').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'GET',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            //let user = JSON.parse(response);
            insertUserData(response);
        },
        error: function(xhr, status, error) {
          // Handle errors
          alert("Forkert adgangskode");
          console.error(error);
        }
      });
    });
});

$(document).ready(function() {
    // Intercept the form submission
    $('#updateUser').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Serialize the form data
      var formData = $(this).serialize();
  
      // Send an AJAX request
      $.ajax({
        type: 'PUT',
        url: $(this).attr('action'),
        data: formData,
        success: function(response, status, xhr) {
            alert(response);
        },
        error: function(xhr, status, error) {
          // Handle errors
          console.error(error);
        }
      });
    });
});

let coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
  });
}