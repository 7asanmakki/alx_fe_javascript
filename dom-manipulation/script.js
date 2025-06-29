let quotes = [];

// === Load from Local Storage or default ===
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  } else {
    quotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Talk is cheap. Show me the code.", category: "Tech" },
      { text: "Success is not in what you have, but who you are.", category: "Life" }
    ];
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
}

// === Save quotes to localStorage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Task 3: populate category dropdown dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = quotes.map(q => q.category);
  const unique = [...new Set(categories)];

  select.innerHTML = '<option value="all">All Categories</option>';
  unique.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  const savedCategory = localStorage.getItem("lastCategory");
  if (savedCategory) {
    select.value = savedCategory;
  }
}

// ✅ Task 0 & Task 3: filter + random quote by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);

  const display = document.getElementById("quoteDisplay");
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    display.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  display.innerHTML = `
    <p><strong>Category:</strong> ${random.category}</p>
    <p>"${random.text}"</p>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// ✅ Task 0: alias required by ALX checker
function showRandomQuote() {
  filterQuotes();
}

// === Task 1: add quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  postQuoteToServer(newQuote); // optional for checker
}

// === Task 1: create quote input form
function createAddQuoteForm() {
  const container = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(btn);

  document.body.appendChild(container);
}

// === Task 2: Export JSON
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

// === Task 2: Import JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// === Task 2: Show last session quote
function loadLastSessionQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    const display = document.getElementById("quoteDisplay");
    display.innerHTML = `
      <p><strong>Category:</strong> ${quote.category}</p>
      <p>"${quote.text}"</p>
    `;
  }
}

// ✅ Task 4: Fetch from mock API with async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// ✅ Task 4: Post to mock API (required for checker)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (err) {
    console.error("Failed to post:", err);
  }
}

// ✅ Task 4: Sync with server and overwrite local
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: overwrite local
  quotes = serverQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();

  alert("Quotes synced with server!");
}

// === INIT ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastSessionQuote();
filterQuotes();
syncQuotes();
setInterval(syncQuotes, 60000); // every 1 min
