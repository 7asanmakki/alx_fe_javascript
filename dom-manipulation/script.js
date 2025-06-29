let quotes = [];

// === Load saved quotes from local storage ===
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
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
}

// === Save quotes to local storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Required: populateCategories using .map and categoryFilter
function populateCategories() {
  const select = document.getElementById("categoryFilter");

  // Extract categories using .map()
  const categories = quotes.map(q => q.category);

  // Remove duplicates using Set
  const uniqueCategories = [...new Set(categories)];

  // Clear current options
  select.innerHTML = '<option value="all">All Categories</option>';

  // Add new options
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // ✅ Restore last selected filter
  const savedCategory = localStorage.getItem("lastCategory");
  if (savedCategory) {
    select.value = savedCategory;
  }
}

// ✅ Required: filterQuotes function
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected); // ✅ save filter

  const quoteDisplay = document.getElementById("quoteDisplay");

  // ✅ filter and display logic
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <p>"${randomQuote.text}"</p>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Both fields required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  // ✅ Update dropdown
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// === Create quote input form dynamically ===
function createAddQuoteForm() {
  const container = document.createElement("div");

  const text = document.createElement("input");
  text.id = "newQuoteText";
  text.placeholder = "Enter a new quote";

  const category = document.createElement("input");
  category.id = "newQuoteCategory";
  category.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  container.appendChild(text);
  container.appendChild(category);
  container.appendChild(btn);
  document.body.appendChild(container);
}

// === Optional: load last quote from session storage
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

// === Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// === Initialize
document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastSessionQuote();
filterQuotes(); // display something initially
