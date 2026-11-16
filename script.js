
/* =========================================================
   MAHANYASA POORVAKA EKADASA RUDRABHISHEKAM
   Website interactions and functionality
   ========================================================= */


/* ---------------------------------------------------------
   1. WEBSITE CONFIGURATION
   --------------------------------------------------------- */

const EVENT_DETAILS = {

    name: "Mahanyasa Poorvaka Ekadasa Rudrabhishekam",

    date: "Saturday, November 28, 2026",

    startTime: "4:00 PM",

    prasadamTime: "8:30 PM",

    venue: "The Palpanoori Residence",

    address: "645 Kitfox Dr NW, Concord, NC 28027",

    host: "Ravi Kiran, Maheshwari Palpanoori, & Family",

    phone: "704-712-6392",

    rsvpDeadline: "Tuesday, November 24, 2026"

};


/*
   Google Apps Script web app address.

   RSVP submissions are sent to Google Sheets.
   Success is displayed only after the backend confirms saving.
*/

const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbzyEwbnLylJqFtKSM1yDopqraGNwzu-1NrypaiBmIPhxtCIrDwwfY8ftQz6VfKIzT79TA/exec";


/* ---------------------------------------------------------
   2. MOBILE NAVIGATION
   --------------------------------------------------------- */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");


if (menuToggle && navLinks) {

    // Open and close the mobile navigation.

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });


    // Close the navigation after selecting a section.

    const navigationItems = navLinks.querySelectorAll("a");

    navigationItems.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });


    // Close the menu if the visitor presses Escape.

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });

}


/* ---------------------------------------------------------
   3. CHERRY BLOSSOM PETAL ANIMATION
   --------------------------------------------------------- */

const petalContainer = document.getElementById("petalContainer");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


function createCherryBlossoms() {

    if (!petalContainer || prefersReducedMotion) {
        return;
    }

    // Number of petals floating through the hero section.

    const numberOfPetals = window.innerWidth <= 650 ? 14 : 24;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfPetals; i++) {

        const petal = document.createElement("span");

        petal.classList.add("petal");

        // Random horizontal starting position.

        const horizontalPosition = Math.random() * 100;

        // Different falling speeds create natural movement.

        const fallingDuration = 11 + Math.random() * 13;

        // Start petals at different points in their animation.

        const startingDelay = Math.random() * -24;

        // Small size differences create visual depth.

        const petalSize = 8 + Math.random() * 9;

        petal.style.left = `${horizontalPosition}%`;

        petal.style.animationDuration = `${fallingDuration}s`;

        petal.style.animationDelay = `${startingDelay}s`;

        petal.style.width = `${petalSize}px`;

        petal.style.height = `${petalSize * 1.4}px`;

        fragment.appendChild(petal);

    }

    petalContainer.appendChild(fragment);

}


// Start the cherry blossom animation.

createCherryBlossoms();


/* ---------------------------------------------------------
   4. ADD TO CALENDAR
   --------------------------------------------------------- */

const calendarButton = document.getElementById("calendarButton");


function downloadCalendarEvent() {

    /*
       The ceremony starts at 4:00 PM.

       We intentionally do not invent an event ending time.
       The calendar file therefore contains a start time
       without an assumed duration.
    */

    const calendarContent = [

        "BEGIN:VCALENDAR",

        "VERSION:2.0",

        "PRODID:-//Palpanoori Family//Rudrabhishekam//EN",

        "CALSCALE:GREGORIAN",

        "METHOD:PUBLISH",

        "BEGIN:VEVENT",

        "UID:rudrabhishekam-20261128@palpanoori",

        "DTSTAMP:20261116T000000Z",

        "DTSTART;TZID=America/New_York:20261128T160000",

        `SUMMARY:${EVENT_DETAILS.name}`,

        `LOCATION:${EVENT_DETAILS.venue}, ${EVENT_DETAILS.address}`,

        `DESCRIPTION:Ganapathi Pooja begins at 4:00 PM. Prasadam at 8:30 PM. Hosted by ${EVENT_DETAILS.host}.`,

        "END:VEVENT",

        "END:VCALENDAR"

    ].join("\r\n");


    // Create a downloadable calendar file.

    const calendarBlob = new Blob(
        [calendarContent],
        {
            type: "text/calendar;charset=utf-8"
        }
    );


    const calendarURL = URL.createObjectURL(calendarBlob);

    const downloadLink = document.createElement("a");

    downloadLink.href = calendarURL;

    downloadLink.download = "Mahanyasa-Ekadasa-Rudrabhishekam.ics";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(calendarURL);

}


if (calendarButton) {

    calendarButton.addEventListener(
        "click",
        downloadCalendarEvent
    );

}


/* ---------------------------------------------------------
   5. RSVP FORM
   --------------------------------------------------------- */

const rsvpForm = document.getElementById("rsvpForm");

const rsvpMessage = document.getElementById("rsvpMessage");

const rsvpSubmit = document.getElementById("rsvpSubmit");


function displayRSVPMessage(message, type) {

    if (!rsvpMessage) {
        return;
    }

    rsvpMessage.textContent = message;

    rsvpMessage.className = `rsvp-message ${type}`;

    rsvpMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


if (rsvpForm) {

    rsvpForm.addEventListener("submit", async (event) => {

        // Prevent the browser from reloading the page.

        event.preventDefault();


        // Check required fields.

        if (!rsvpForm.reportValidity()) {
            return;
        }


        // Ensure the RSVP service is configured.

        if (!RSVP_ENDPOINT) {

            displayRSVPMessage(

                "Thank you for your interest! The RSVP service is being set up. Please try again once online registration is available, or contact 704-712-6392.",

                "error"

            );

            return;

        }


        // Collect the form information.

        const formData = new FormData(rsvpForm);

        const submission = {

            fullName: formData.get("fullName").trim(),

            phone: formData.get("phone").trim(),

            guestCount: formData.get("guestCount").trim(),

            attendance: formData.get("attendance")

        };


        // Prevent repeated clicks during submission.

        rsvpSubmit.disabled = true;

        rsvpSubmit.textContent = "Submitting...";

        rsvpMessage.className = "rsvp-message";

        try {

            // Send the information to Google Apps Script.

            const response = await fetch(RSVP_ENDPOINT, {

                method: "POST",

                body: new URLSearchParams(submission)

            });


            if (!response.ok) {

                throw new Error("The RSVP server could not be reached.");

            }


            const result = await response.json();


            // Only display success if the backend confirms saving.

            if (result.success === true) {

                let confirmationMessage;


                // Confirmation for guests who are attending.

                if (submission.attendance === "Yes") {

                    confirmationMessage =
                        "Thank you! Your RSVP has been successfully recorded. We look forward to welcoming you and your guests.";

                }


                // Confirmation for guests who are unsure.

                else if (submission.attendance === "Maybe") {

                    confirmationMessage =
                        "Thank you for letting us know! We've recorded your response as Maybe. If your plans become clear, please feel free to update us. We hope to see you there.";

                }


                // Confirmation for guests who cannot attend.

                else if (submission.attendance === "No") {

                    confirmationMessage =
                        "Thank you for letting us know. We've recorded your response. We're sorry you won't be able to join us, and we send you and your family our warm wishes.";

                }


                // General confirmation fallback.

                else {

                    confirmationMessage =
                        "Thank you! Your RSVP has been successfully recorded.";

                }


                displayRSVPMessage(
                    confirmationMessage,
                    "success"
                );

                rsvpForm.reset();

            } else {

                throw new Error(
                    result.message || "Your RSVP could not be saved."
                );

            }

        } catch (error) {

            console.error("RSVP submission error:", error);

            displayRSVPMessage(

                "We couldn't confirm your RSVP. Your response has not been confirmed as saved. Please try again or contact 704-712-6392.",

                "error"

            );

        } finally {

            rsvpSubmit.disabled = false;

            rsvpSubmit.textContent = "Submit RSVP";

        }

    });

}


/* ---------------------------------------------------------
   6. SMOOTH NAVIGATION
   --------------------------------------------------------- */

// Support smooth scrolling for internal section links.

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") {
            return;
        }

        const targetElement = document.querySelector(targetID);

        if (targetElement) {

            event.preventDefault();

            targetElement.scrollIntoView({

                behavior: prefersReducedMotion ? "auto" : "smooth",

                block: "start"

            });

        }

    });

});


/* ---------------------------------------------------------
   7. WEBSITE INITIALIZATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Mahanyasa Poorvaka Ekadasa Rudrabhishekam website initialized."
    );

});
