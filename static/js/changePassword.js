function validate() {
    var pass = document.getElementById("newpassword").value;
    var cpass = document.getElementById("cpassword").value;
    var passportNo = document.getElementById("passportNo").value;
    var drivingLicenceNo = document.getElementById("licenseNo").value;
    if (pass == cpass) {
        return true;
    } else {
        alert("Passwords do not match!");
        return false;
    }
}

