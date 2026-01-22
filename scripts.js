// URL of your DRF ModelViewSet router
const API_BASE = "http://127.0.0.1:8000/api/listings/"; // trailing slash required
let selectedProperty = null;

/* Load all listings */
async function loadProperties() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        renderProperties(data);
    } catch (err) {
        console.error("Failed to load properties", err);
        document.getElementById("propertyList").innerHTML =
            "<p style='color:red'>Error loading properties. Make sure Django server is running.</p>";
    }
}

/* Render property cards */
function renderProperties(properties) {
    const list = document.getElementById("propertyList");
    list.innerHTML = "";

    properties.forEach(property => {
        const imageUrl = property.image ? `http://127.0.0.1:8000${property.image}` : 'placeholder.jpg';
        list.innerHTML += `
            <div class="property">
                <img src="${imageUrl}" />
                <div class="property-content">
                    <h3>${property.title}</h3>
                    <p>${property.description}</p>
                    <p>₦${property.price}</p>
                    <p>${property.category.toUpperCase()}</p>
                    <p>${property.location}</p>
                    <button onclick="openModal(${property.id})">
                        Proceed
                    </button>
                </div>
            </div>
        `;
    });
}

/* Upload property */
async function addProperty() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const location = document.getElementById("location").value;
    const type = document.getElementById("type").value;
    const image = document.getElementById("image").files[0];

    if (!title || !description || !price || !location || !type || !image) {
        alert("Please fill all fields");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("category", type); // Must match model field
    formData.append("image", image);

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            body: formData,
            credentials: "include" // optional: if using auth
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Upload error:", errorData);
            throw new Error("Upload failed");
        }

        alert("Property uploaded successfully!");
        clearForm();
        loadProperties();
    } catch (err) {
        alert("Error uploading property. Check console for details.");
        console.error(err);
    }
}

/* Modal functions */
async function openModal(id) {
    try {
        const res = await fetch(`${API_BASE}${id}/`);
        if (!res.ok) throw new Error("Failed to load property");
        selectedProperty = await res.json();

        document.getElementById("checkoutInfo").innerText =
            `${selectedProperty.category.toUpperCase()} - ${selectedProperty.title}\nPrice: ₦${selectedProperty.price}`;
        document.getElementById("modal").style.display = "block";
    } catch (err) {
        console.error("Failed to load property", err);
        alert("Failed to load property. Check console.");
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function confirmPurchase() {
    alert(`You selected "${selectedProperty.title}" for ${selectedProperty.category.toUpperCase()}.`);
    closeModal();
}

/* Clear form after upload */
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("location").value = "";
    document.getElementById("type").value = "";
    document.getElementById("image").value = "";
}

/* Load properties on page load */
document.addEventListener("DOMContentLoaded", loadProperties);
