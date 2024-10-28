/* eslint-disable no-undef */

/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// Accessibility button

const accessibilityButton = document.querySelector('.btn-accessibility');

accessibilityButton.addEventListener('click', () => {
	Liferay.fire('openAccessibilityMenu');
});

const showAccessibilityMenuButton = () => {
	const accessibilityMenuIsEnabled = document.querySelector(
		'.accessibility-menu'
	);

	if (accessibilityMenuIsEnabled) {
		accessibilityButton.removeAttribute('disabled');
	}
};

showAccessibilityMenuButton();

// Picker

const html = document.querySelector('html');
const localStorageName = 'liferay:theme-color';

let activeIndex = 0;
let isOpen = false;

const picker = document.querySelector('.js-picker');

const combobox = picker.querySelector('[role=combobox]');
const comboboxId = combobox.id || 'combo';
const listbox = picker.querySelector('[role=listbox]');
const options = [...listbox.querySelectorAll('[role=option]')].map(
	(option) => option.dataset.value
);
const pickerLabel = picker.querySelector('label');
const selectActions = {
	close: 0,
	closeSelect: 1,
	next: 2,
	open: 3,
	previous: 4,
};

const getSystemTheme = () => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
};

const updateComboboxAriaLabel = (value) => {
	pickerLabel.innerHTML = `Select Theme Color. Currently selected: ${value}`;
};

const updateComboboxIcon = () => {
	const theme = localStorage.getItem(localStorageName) || 'auto';

	combobox.removeAttribute('disabled');

	const pickerIcons = document.querySelectorAll('.picker-icon');

	[...pickerIcons].forEach((pickerIcon) => {
		pickerIcon.classList.add('d-none');

		if (pickerIcon.dataset.value === theme) {
			pickerIcon.classList.remove('d-none');
		}
	});
};

const updateMenuState = (open, callFocus = true) => {
	if (isOpen === open) {
		return;
	}

	isOpen = open;

	combobox.setAttribute('aria-expanded', `${open}`);

	if (open) {
		listbox.classList.add('show');
	} else {
		listbox.classList.remove('show');
	}

	// Update activedescendant

	const activeId = open ? `${comboboxId}-${activeIndex}` : '';
	combobox.setAttribute('aria-activedescendant', activeId);

	if (callFocus) {
		// Move focus back to the combobox, if needed
		combobox.focus();
	}
};

const selectOption = (index) => {
	activeIndex = index;

	const pickerOptions = picker.querySelectorAll('[role=option]');

	[...pickerOptions].forEach((option) => {
		option.setAttribute('aria-selected', 'false');
	});

	pickerOptions[index].setAttribute('aria-selected', 'true');

	const themeColor = index === 2 ? getSystemTheme() : options[index];

	localStorage.setItem(localStorageName, options[index]);

	html.setAttribute('data-theme', themeColor);

	updateComboboxAriaLabel(options[index]);

	updateComboboxIcon();
};

const initializeOption = (value, index) => {
	const option = listbox.querySelector(`[data-value="${value}"]`);

	const theme = localStorage.getItem(localStorageName) || 'auto';

	const isSelected = value === theme;

	if (isSelected) {
		activeIndex = index;

		option.classList.add('hover');
	} else {
		option.classList.remove('hover');
	}

	option.setAttribute('aria-selected', `${isSelected}`);

	updateComboboxAriaLabel(theme);

	option.addEventListener('click', (event) => {
		event.stopPropagation();

		onOptionChange(index);
		selectOption(index);
		updateMenuState(false);
	});
};

const onOptionChange = (index, callFocus = false) => {
	activeIndex = index;

	combobox.setAttribute('aria-activedescendant', `${comboboxId}-${index}`);

	const pickerOptions = picker.querySelectorAll('[role=option]');

	[...pickerOptions].forEach((option) => {
		option.classList.remove('hover', 'focus');
	});

	pickerOptions[index].classList.add('hover');

	if (callFocus) {
		pickerOptions[index].classList.add('focus');
	}
};

const updateFocusOption = (index = null) => {
	const pickerOptions = picker.querySelectorAll('[role=option]');

	[...pickerOptions].forEach((option) => {
		option.classList.remove('focus');
	});

	if (index !== null) {
		pickerOptions[index].classList.add('focus');
	}
};

const onComboKeyDown = (event) => {
	const max = options.length - 1;

	const action = getActionFromKey(event, isOpen);

	switch (action) {
		case selectActions.next:
		case selectActions.previous:
			event.preventDefault();

			return onOptionChange(
				getUpdatedIndex(activeIndex, max, action),
				true
			);
		case selectActions.closeSelect:
			event.preventDefault();

			selectOption(activeIndex);

		case selectActions.close:
			event.preventDefault();

			return updateMenuState(false);

		case selectActions.open:
			event.preventDefault();

			// Add option focus when combobox is open
			updateFocusOption(activeIndex);

			return updateMenuState(true);

		default:
			return;
	}
};

const getUpdatedIndex = (currentIndex, maxIndex, action) => {
	switch (action) {
		case selectActions.previous:
			return Math.max(0, currentIndex - 1);
		case selectActions.next:
			return Math.min(maxIndex, currentIndex + 1);
		default:
			return currentIndex;
	}
};

const onComboBlur = (event) => {
	// When clicking
	if (listbox.contains(event.relatedTarget)) {
		return;
	}

	// Select current option and close
	if (isOpen) {
		selectOption(activeIndex);
		updateMenuState(false, false);
	}
};

const getActionFromKey = (event, menuOpen) => {
	const {altKey, key} = event;
	const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ']; // all keys that will do the default open action

	// Handle opening when closed
	if (!menuOpen && openKeys.includes(key)) {
		return selectActions.open;
	}

	// Handle keys when open
	if (menuOpen) {
		if (key === 'ArrowUp' && altKey) {
			return selectActions.closeSelect;
		} else if (key === 'ArrowDown' && !altKey) {
			return selectActions.next;
		} else if (key === 'ArrowUp') {
			return selectActions.previous;
		} else if (key === 'Escape') {
			return selectActions.close;
		} else if (key === 'Enter' || key === ' ') {
			return selectActions.closeSelect;
		}
	}
};

const getThemeColor = () => {
	let storedTheme = localStorage.getItem(localStorageName);

	if (!storedTheme || storedTheme === 'auto') {
		storedTheme = getSystemTheme();
	}

	return storedTheme;
};

const setThemeColor = () => {
	const storedTheme = getThemeColor();

	html.setAttribute('data-theme', storedTheme);
};

// Refresh every time the operating system theme changes
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', () => {
		setThemeColor();
	});

// Set the initial theme
setThemeColor();

// Set the initial combobox icon
updateComboboxIcon();

// Init options
options.forEach((option, index) => {
	initializeOption(option, index);
});

// Set events
combobox.addEventListener('click', () => {
	// Remove the focus if it was there before
	updateFocusOption();

	updateMenuState(!isOpen, false);
});
combobox.addEventListener('keydown', onComboKeyDown);
combobox.addEventListener('blur', onComboBlur);

// Animations

// animScoll with animate.css
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const animationClass =
				entry.target.getAttribute('data-animation') || 'fadeIn';
			entry.target.classList.add(
				'animate__animated',
				`animate__${animationClass}`,
				'visible'
			);
			observer.unobserve(entry.target);
		}
	});
});

const items = [...document.querySelectorAll('[data-animation]')];

items.forEach((item) => {
	item.classList.add('onScroll');

	observer.observe(item);
});
