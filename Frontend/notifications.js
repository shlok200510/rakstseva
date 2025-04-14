document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.getElementById("notification-button");
    const notificationList = document.getElementById("notification-list");

    if (notificationButton) {
        notificationButton.addEventListener("click", function () {
            notificationList.classList.toggle("hidden");
        });
    }

    // Close the notification list when clicking outside
    document.addEventListener("click", function (event) {
        if (!notificationButton.contains(event.target) && !notificationList.contains(event.target)) {
            notificationList.classList.add("hidden");
        }
    });
});
