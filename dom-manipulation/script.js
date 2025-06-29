// ✅ 1. quotes array with text and category
const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Talk is cheap. Show me the code.", category: "Tech" },
  { text: "Success is not in what you have, but who you are.", category: "Life" }
];

// ✅ 2. Show random quote from array
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes yet!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <p>"${randomQuote.text}"</p>
  `;
}

// ✅ 3. Add new quote to array and update DOM
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  // Push to array
  quotes.push({ text, category });

  // Clear form
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update DOM immediately
  showRandomQuote();
}

// ✅ 4. Add event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
