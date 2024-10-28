const html = document.querySelector('html');
const localStorageName = 'liferay:theme-color';
const themeColor = localStorage.getItem(localStorageName);
html.setAttribute('data-theme', themeColor);
