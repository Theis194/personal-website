function insertUserData(user) {
    let updateUser = document.getElementById("updateUser");

    updateUser.querySelector("#fName").value = user.fName;
    updateUser.querySelector("#lName").value = user.lName;
    updateUser.querySelector("#emailU").value = user.email;
    let authorCheck = updateUser.querySelector("#author");
    let adminCheck = updateUser.querySelector("#admin");
    authorCheck.checked = false;
    adminCheck.checked = false;
    for (let i = 0; i < user.privileges.length; i++) {
        switch (user.privileges[i]) {
          case "author":
            authorCheck.checked = true;
            break;
          case "admin":
            adminCheck.checked = true;
            break;
        }
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