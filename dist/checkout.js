'use strict';

// Display-only handoff. These values never grant access and are not trusted payment data.
// The future server must verify the account, determine the price and create the order.
const catalog = {
  boost_3d: { price: 75, period: '3 дня доступа' },
  boost_7d: { price: 150, period: '7 дней доступа' },
  boost_30d: { price: 400, period: '30 дней доступа' }
};
const params = new URLSearchParams(location.search);
const plan = document.querySelector('#checkout-plan');
const account = document.querySelector('#account-id');
const message = document.querySelector('#account-message');
const validAccount = value => /^[1-9][0-9]{4}$/.test(value);
const requestedPlan = params.get('plan');
if (requestedPlan && Object.hasOwn(catalog, requestedPlan)) plan.value = requestedPlan;
const requestedAccount = params.get('account');
if (requestedAccount && validAccount(requestedAccount)) account.value = requestedAccount;

function updateSummary() {
  const selected = catalog[plan.value];
  document.querySelector('#summary-price').textContent = selected.price;
  document.querySelector('#summary-period').textContent = selected.period;
  const id = account.value.trim();
  document.querySelector('#summary-account').textContent = validAccount(id) ? `ID ${id}` : 'ID ещё не указан';
  if (!id) { message.textContent = ''; account.removeAttribute('aria-invalid'); }
  else if (!validAccount(id)) { message.textContent = 'ID — пять цифр, первая не может быть нулём.'; account.setAttribute('aria-invalid', 'true'); }
  else { message.textContent = 'Формат ID верный. Аккаунт нужно будет проверить перед оплатой.'; account.setAttribute('aria-invalid', 'false'); }
}
plan.addEventListener('change', updateSummary);
account.addEventListener('input', updateSummary);
document.querySelector('#checkout-form').addEventListener('submit', event => event.preventDefault());
updateSummary();
if (requestedPlan && !Object.hasOwn(catalog, requestedPlan)) {
  message.textContent = 'Срок из ссылки не найден. Выбери подходящий тариф выше.';
}
if (requestedAccount && !validAccount(requestedAccount)) {
  message.textContent = 'ID из ссылки указан неверно. Проверь его в профиле kerido и введи заново.';
  account.setAttribute('aria-invalid', 'true');
}
