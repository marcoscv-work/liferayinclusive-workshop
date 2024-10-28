const submit = document.querySelector('button[type="submit"]');
const message = document.querySelector('.checklist-message');
const messageText = document.querySelector('.checklist-message .message');

submit.addEventListener('click', (event) => {
	event.preventDefault();

	const checkboxs = [
		...document.querySelectorAll(
			'input.form-check-input[type="checkbox"][data-hidden="false"]'
		),
	];

	const activeCheckboxs = checkboxs.filter((checkbox) => checkbox.checked);

	const score = ((100 / checkboxs.length) * activeCheckboxs.length).toFixed(
		1
	);

	message.classList.remove('d-none');
	message.classList.add('animate__animated', 'animate__fadeInUp');
	message.scrollIntoView();

	let text = 'Excellent! You have reached the maximum score.';

	if (score < 20) {
		text = 'You still have a lot of work to do!';
	} else if (score < 50) {
		text = 'Things get better, but there is still work to do!';
	} else if (score < 70) {
		text = 'Good job, that is the way!';
	} else if (score < 90) {
		text = 'Great job, you are close to the goal!';
	}
	messageText.innerHTML = `Your score is ${score}%. ${text}`;
});

let activatedLabels = [];
const filters = [...document.querySelectorAll('.toggle-switch-check')];

filters.forEach((filter) => {
	filter.addEventListener('change', () => {
		activatedLabels = filters
			.filter((filter) => filter.checked)
			.map((filter) => filter.dataset.label);

		const criteria = [...document.querySelectorAll('.criterion')];

		criteria.forEach((criterion) => {
			criterion.classList.add('d-none');
			criterion.querySelector('input').setAttribute('data-hidden', true);
		});

		const filteredCriteria = criteria.filter((criterion) =>
			activatedLabels.some((label) =>
				criterion
					.querySelector('.list-group-header')
					.textContent.includes(label)
			)
		);

		filteredCriteria.forEach((criterion) => {
			criterion.classList.remove('d-none');
			criterion.querySelector('input').setAttribute('data-hidden', false);
		});

		// Update filter

		document.getElementById('filterStatus').innerHTML =
			filteredCriteria.length;

		// Hide or show the evaluate button

		if (filteredCriteria.length) {
			submit.classList.remove('d-none');
		} else if (!submit.classList.contains('d-none')) {
			submit.classList.add('d-none');
		}
	});
});
