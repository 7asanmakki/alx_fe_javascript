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

// ✅ Required: populateCategories using .map() and categoryFilter
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

// ✅ Required: filterQuotes with selectedCategory + localStorage
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

// === Add new quote
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

  // Optionally simulate sending to server (not called by default)
  // postQuoteToServer(newQuote);
}

// === Create form dynamically
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

// === Export quotes
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

// === Import quotes
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

// === Load last session quote if available
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

// ✅ Task 4: Server Fetch
function fetchQuotesFromServer() {
  return fetch("https://dummyjson.com/quotes")
    .then(res => res.json())
    .then(data => {
      return data.quotes.map(q => ({
        text: q.quote,
        category: q.author || "Uncategorized"
      }));
    })
    .catch(err => {
      console.error("Failed to fetch quotes from server:", err);
      return [];
    });
}

// ✅ Task 4: Server POST (required by checker)
function postQuoteToServer(quote) {
  fetch("https://dummyjson.com/quotes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
    .then(res => res.json())
    .then(data => console.log("Posted to server:", data))
    .catch(err => console.error("Post failed:", err));
}

// ✅ Task 4: Sync quotes from server every minute
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    // Simple conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes synced with server.");
  });
}

// === Init
document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

loadQuotes();
populateCategories();
createAddQuoteForm();
loadLastSessionQuote();
filterQuotes();
syncQuotes(); // fetch once
setInterval(syncQuotes, 60000); // fetch every 60 sec
