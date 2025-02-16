document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons and contents
            buttons.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));

            // Add active class to clicked button and corresponding content
            this.classList.add("active");
            document.getElementById(this.dataset.target).classList.add("active");
        });
    });
});
