const submit = document.querySelector('button[type="submit"]');
const message = document.querySelector('.checklist-message');
const messageText = document.querySelector('.checklist-message .message');

submit.addEventListener('click', (event) => {
	event.preventDefault();

	const checkboxs = [...document.querySelectorAll('input[type="checkbox"]')];

	const score = parseFloat(
		checkboxs
			.filter((checkbox) => checkbox.checked)
			.reduce((acc, checkbox) => {
				return acc + parseFloat(checkbox.dataset.score);
			}, 0)
	).toFixed(1);

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
