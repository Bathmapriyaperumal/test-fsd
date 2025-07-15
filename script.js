let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editingIndex = -1;

const form = document.getElementById("entry-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryList = document.getElementById("entry-list");
const resetBtn = document.getElementById("reset-btn");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");

const filterRadios = document.querySelectorAll('input[name="filter"]');

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    description: descInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
  };

  if (editingIndex >= 0) {
    entries[editingIndex] = entry;
    editingIndex = -1;
  } else {
    entries.push(entry);
  }

  saveEntries();
  renderEntries();
  form.reset();
});

resetBtn.addEventListener("click", () => form.reset());

filterRadios.forEach((radio) =>
  radio.addEventListener("change", () => renderEntries())
);

function renderEntries() {
  entryList.innerHTML = "";

  const filter = document.querySelector('input[name="filter"]:checked').value;
  let income = 0,
    expense = 0;

  entries.forEach((entry, index) => {
    if (filter !== "all" && filter !== entry.type) return;

    const li = document.createElement("li");
    li.className = "entry-item";
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount} (${entry.type})</span>
      <span class="entry-actions">
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;
    entryList.appendChild(li);
  });

  entries.forEach((e) => {
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  });

  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  netBalance.textContent = income - expense;
}

function editEntry(index) {
  const entry = entries[index];
  descInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editingIndex = index;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  saveEntries();
  renderEntries();
}

function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

renderEntries();
