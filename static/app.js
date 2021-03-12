class BoggleGame {

	constructor(secs = 60) {
		this.secs = secs; 
		this.showTimer();
        this.score = 0; 
		this.words = new Set(); 
		this.board = $('#boggle');

		this.timer = setInterval(this.tick.bind(this), 1000);

		$('.add-word').on('submit', this.handleSubmit.bind(this));
	}

	showWord(word) {
		$('.words', this.board).append($('<li>', { text: word }));
	}


	showScore() {
		$('.score').text(this.score);
	}


	showMessage(msg, cls) {
		$('.msg').text(msg).removeClass().addClass(`msg ${cls}`);
	}


	async handleSubmit(evt) {
		evt.preventDefault();
		const $word = $('.word');

		let word = $word.val();
		if (!word) return;

		if (this.words.has(word)) {
			this.showMessage(`Already found ${word}`, 'error');
			return;
		}

		const resp = await axios.get('/check-word', { params: { word: word } });
		if (resp.data.result === 'not-word') {
			this.showMessage(`${word} is not a valid English word`, 'error');
		} else if (resp.data.result === 'not-on-board') {
			this.showMessage(
				`${word} is not a valid word on this board`,
				'error'
			);
		} else {
			this.showWord(word);
			this.score += word.length;
			this.showScore();
			this.words.add(word);
			this.showMessage(`Added: ${word}`, 'success');
		}

		$word.val('');
	}


	showTimer() {
		$('.timer').text(this.secs);
	}


	async tick() {
		this.secs -= 1;
		this.showTimer();

		if (this.secs === 0) {
			clearInterval(this.timer);
			await this.scoreGame();
		}
	}


	async scoreGame() {
		$('.add-word').hide();
		const resp = await axios.post('/post-score', { score: this.score });
		if (resp.data.brokeRecord) {
			this.showMessage(`New record: ${this.score}`, 'success');
		} else {
			this.showMessage(`Final score: ${this.score}`, 'success');
		}
	}
}
let game = new BoggleGame();
