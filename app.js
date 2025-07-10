let currentPage = 1;
const transactionsPerPage = 10;

async function fetchTransactions() {
  const table = document.getElementById("transactionTable");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  try {
    table.innerHTML = `<tr><td colspan="6" class="loading">Loading...</td></tr>`;
    
    const response = await fetch(`/api/polygon-transactions?page=${currentPage}&limit=${transactionsPerPage}`);
    const data = await response.json();

    if (data.status === "1" && data.result.length > 0) {
      renderTransactions(data.result);
      updatePagination(data.result.length >= transactionsPerPage);
    } else {
      table.innerHTML = `<tr><td colspan="6">No transactions found</td></tr>`;
    }
  } catch (error) {
    table.innerHTML = `<tr><td colspan="6" class="error">Error: ${error.message}</td></tr>`;
  }
}

function renderTransactions(transactions) {
  const table = document.getElementById("transactionTable");
  table.innerHTML = transactions.map(tx => `
    <tr>
      <td>${new Date(tx.timeStamp * 1000).toLocaleString()}</td>
      <td>${formatAddress(tx.from)}</td>
      <td>${formatAddress(tx.to)}</td>
      <td>${(tx.value / 1e18).toFixed(4)}</td>
      <td>${tx.blockNumber}</td>
      <td><a href="https://polygonscan.com/tx/${tx.hash}" target="_blank">View</a></td>
    </tr>
  `).join('');
}

function formatAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';
}

function updatePagination(hasMore) {
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = !hasMore;
}

// Event listeners
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchTransactions();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  fetchTransactions();
});

// Init
document.addEventListener('DOMContentLoaded', fetchTransactions);