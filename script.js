const form = document.getElementById("paymentForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const amount = document.getElementById("amount").value;

    message.textContent = "Initializing payment...";

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/payments/paystack/init",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    amount: amount * 100  // convert Naira to Kobo
                })
            }
        );

        const data = await response.json();

        if (data.status === true) {
            // Redirect to Paystack checkout
            window.location.href = data.data.authorization_url;
        } else {
            message.textContent = "Payment initialization failed";
        }

    } catch (error) {
        message.textContent = "Error connecting to server";
        console.error(error);
    }
});