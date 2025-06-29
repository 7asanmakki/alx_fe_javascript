// === Declare quotes array globally ===
let quotes = [];

// === Load quotes from local storage on init ===
function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    quotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Talk is cheap. Show me the code.", category: "Tech" },
      { text: "Success is not in what you have, but who you are.", category: "Life" }
    ];
    localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ match exact string
  }
}

// === Save quotes to local storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ match exact string
}

// === Display random quote and save to session storage ===
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <p>"${randomQuote.text}"</p>
  `;

  // ✅ Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// === Add new quote and update local storage ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes(); // ✅ triggers localStorage.setItem

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
}

// === Create input form dynamically ===
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// === Export quotes to JSON file ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// === Import quotes from JSON file ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ exact
    alert("Quotes imported successfully!");
    showRandomQuote();
  };

  fileReader.readAsText(event.target.files[0]);
}

// === Load last viewed quote from sessionStorage ===
function loadLastSessionQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Category:</strong> ${quote.category}</p>
      <p>"${quote.text}"</p>
    `;
  }
}

// === Initialization ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

loadQuotes();
createAddQuoteForm();
loadLastSessionQuote();
