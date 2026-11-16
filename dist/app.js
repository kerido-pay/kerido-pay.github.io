'use strict';

const modules = {
  anti: { title: 'Действия по твоему расписанию', tag: 'ВКЛЮЧЕНО В LITE', description: 'Выбери клавиши и паузы между нажатиями. kerido будет выполнять периодические действия, пока ты занят другими делами.', points: ['Свои клавиши, интервалы и длительность', 'Случайный выбор действия с повторами', 'Остановка по таймеру'], example: 'Например, повторять разрешённое действие в приложении через заданный интервал.', image: 'assets/anti.png', alt: 'Реальный интерфейс модуля Анти-АФК: клавиши, интервалы, таймер и привязанное окно' },
  clicker: { title: 'Повторяющиеся клики без повторений с твоей стороны', tag: 'ВКЛЮЧЕНО В LITE', description: 'Настрой кнопку мыши или клавишу, частоту и точку клика. Запускай автокликер одним нажатием или только на время удержания горячей клавиши.', points: ['Режим переключения или удержания', 'Настройка интервала между кликами', 'Своя клавиша запуска, по умолчанию F6'], example: 'Например, повторять нажатие одной кнопки при тестировании интерфейса своей программы.', image: 'assets/clicker.png', alt: 'Реальный интерфейс Автокликера: настройки кнопки, интервала и режима запуска' },
  scanner: { title: 'Увидел символ — выполнил действие', tag: 'ДОСТУПНО С BOOST', description: 'Выдели участок экрана, в котором появляются буквы или цифры. OCR распознаёт разрешённые символы и отправляет соответствующие нажатия.', points: ['Выбранная область, а не весь экран', 'Настройка распознаваемых символов', 'Реакция на экранные подсказки'], example: 'Например, нажимать клавишу, указанную в повторяющейся экранной подсказке.', image: 'assets/scanner.png', alt: 'Реальный интерфейс Экранного OCR: области распознавания и настройки клавиш' },
  farm: { title: 'Один цикл. Столько повторов, сколько нужно.', tag: 'ДОСТУПНО С BOOST', description: 'АвтоФарм повторяет цикл нажатия рабочей клавиши и ожидания. Дополнительные настройки позволяют реагировать на подсказки и арифметические задания на экране.', points: ['Рабочая клавиша, удержание и пауза', 'Распознавание подсказок в выбранной области', 'Распознавание арифметических проверок'], example: 'Для повторяемых экранных задач с одинаковым циклом действий. Используй там, где автоматизация разрешена.', image: 'assets/farm.png', alt: 'Реальный интерфейс АвтоФарма: цикл действий, экранные подсказки и распознавание' }
};

const tabs = [...document.querySelectorAll('[data-module]')];
function selectModule(tab, focus = false) {
  const data = modules[tab.dataset.module];
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  document.querySelector('#module-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#module-title').textContent = data.title;
  document.querySelector('#module-tag').textContent = data.tag;
  document.querySelector('#module-description').textContent = data.description;
  document.querySelector('#module-example').textContent = data.example;
  document.querySelector('#module-points').replaceChildren(...data.points.map(point => { const li = document.createElement('li'); li.textContent = point; return li; }));
  const img = document.querySelector('#module-image'); img.src = data.image; img.alt = data.alt;
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectModule(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectModule(tabs[next], true); }
  });
});

const plans = { 3: { price: 75, label: '3 дня', term: 'за 3 дня доступа' }, 7: { price: 150, label: '7 дней', term: 'за 7 дней доступа' }, 30: { price: 400, label: '30 дней', term: 'за 30 дней доступа' } };
let days = 30;
document.querySelectorAll('[data-days]').forEach(button => button.addEventListener('click', () => {
  days = Number(button.dataset.days);
  document.querySelectorAll('[data-days]').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
  document.querySelector('#boost-price').textContent = plans[days].price;
  document.querySelector('#boost-duration').textContent = plans[days].term;
  document.querySelector('#boost-details').href = `checkout.html?plan=boost_${days}d`;
}));

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); nav.classList.toggle('is-open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Открыть меню'); nav.classList.remove('is-open'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
