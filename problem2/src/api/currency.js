export async function fetchCurrencies() {
  const response = await fetch('https://interview.switcheo.com/prices.json');
  if (!response.ok) {
    throw new Error('Failed to fetch currency data');
  }
  return await response.json();
}
