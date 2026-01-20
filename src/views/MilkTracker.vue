<script setup>
import { ref, computed } from 'vue';

// Form Inputs
const bagName = ref('');
const datePumped = ref('');
const amount = ref(null);

// Filter Inputs
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterMinAmount = ref(null);
const filterMaxAmount = ref(null);

// Milk bags data
const bags = ref([]);

// Freezer expiration days
const FREEZER_DAYS = 180; // 6 months

function addBag() {
  const pumpedDate = new Date(datePumped.value);
  const expirationDate = new Date(pumpedDate);
  expirationDate.setDate(expirationDate.getDate() + FREEZER_DAYS);

  bags.value.push({
    bagName: bagName.value,
    datePumped: datePumped.value,
    amount: amount.value,
    expiresOn: expirationDate.toISOString().split('T')[0],
  });

  bagName.value = '';
  datePumped.value = '';
  amount.value = null;
}

function removeBag(index) {
  bags.value.splice(index, 1);
}

// Status logic
function bagStatus(bag) {
  const today = new Date();
  const expDate = new Date(bag.expiresOn);
  const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'Expired';
  if (diffDays <= 7) return 'Expiring Soon';
  return 'Good';
}

function statusClass(bag) {
  const status = bagStatus(bag);
  return {
    expired: status === 'Expired',
    expiring: status === 'Expiring Soon',
    good: status === 'Good',
  };
}

// Filtered bags
const filteredBags = computed(() => {
  return bags.value.filter(bag => {
    const bagDate = new Date(bag.datePumped);
    const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
    const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
    const minAmt = filterMinAmount.value != null ? filterMinAmount.value : null;
    const maxAmt = filterMaxAmount.value != null ? filterMaxAmount.value : null;

    if (startDate && bagDate < startDate) return false;
    if (endDate && bagDate > endDate) return false;
    if (minAmt != null && bag.amount < minAmt) return false;
    if (maxAmt != null && bag.amount > maxAmt) return false;

    return true;
  });
});
</script>

<template>
  <div class="container">
    <h2>Milk Tracker</h2>

    <!-- Add Bag Form -->
    <div class="form-card">
      <input type="text" v-model="bagName" placeholder="Bag Name" />
      <input type="date" v-model="datePumped" />
      <input type="number" v-model.number="amount" placeholder="Amount (oz)" />
      <button @click="addBag">Add Bag</button>
    </div>

    <!-- Filters -->
    <!-- <div class="filter-card">
      <input type="date" v-model="filterStartDate" placeholder="From Date" />
      <input type="date" v-model="filterEndDate" placeholder="To Date" />
      <input type="number" v-model.number="filterMinAmount" placeholder="Min Amount" />
      <input type="number" v-model.number="filterMaxAmount" placeholder="Max Amount" />
    </div> -->

    <!-- Cards (mobile) -->
    <div class="bag-cards mobile-only" v-if="filteredBags.length">
      <div v-for="(bag, index) in filteredBags" :key="index" class="bag-card">
        <div><strong>Bag Name:</strong> {{ bag.bagName }}</div>
        <div><strong>Date Pumped:</strong> {{ bag.datePumped }}</div>
        <div><strong>Amount:</strong> {{ bag.amount }} oz</div>
        <div><strong>Expires On:</strong> {{ bag.expiresOn }}</div>
        <div>
          <strong>Status:</strong>
          <span :class="statusClass(bag)">{{ bagStatus(bag) }}</span>
        </div>
        <button @click="removeBag(index)">Remove</button>
      </div>
    </div>

    <!-- Table (desktop) -->
    <table class="bag-table desktop-only" v-if="filteredBags.length">
      <thead>
        <tr>
          <th>Bag Name</th>
          <th>Date Pumped</th>
          <th>Amount (oz)</th>
          <th>Expires On</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bag, index) in filteredBags" :key="index">
          <td>{{ bag.bagName }}</td>
          <td>{{ bag.datePumped }}</td>
          <td>{{ bag.amount }}</td>
          <td>{{ bag.expiresOn }}</td>
          <td><span :class="statusClass(bag)">{{ bagStatus(bag) }}</span></td>
          <td><button @click="removeBag(index)">Remove</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else>No milk bags found.</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form & Filter Cards */
.form-card,
.filter-card {
  border: 2px dashed #aaa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #f9f9f9;
}

input {
  padding: 6px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  flex: 1 1 120px;
}

button {
  padding: 6px 12px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  border-color: #555;
  background: #eee;
}

/* Bag cards */
.bag-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bag-card {
  border: 2px dashed #aaa;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bag-card strong {
  font-weight: 600;
}

/* Status colors */
.expired {
  color: #d9534f;
  border-color: #d9534f;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.expiring {
  color: #f0ad4e;
  border-color: #f0ad4e;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.good {
  color: #5cb85c;
  border-color: #5cb85c;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* Tables */
.bag-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.bag-table th,
.bag-table td {
  border: 2px dashed #aaa;
  padding: 8px;
  text-align: left;
}

.bag-table th {
  background-color: #f0f0f0;
  font-weight: 600;
}

/* Hide on mobile by default */
.desktop-only {
  display: none;
}

/* Show only on mobile */
.mobile-only {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Responsive breakpoint: desktop */
@media (min-width: 768px) {
  .desktop-only {
    display: table;
  }

  .mobile-only {
    display: none;
  }
}
</style>
