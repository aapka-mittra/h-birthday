// Change this value to personalize the greeting; the balloons and final message update automatically.
const birthdayName = 'ARNAV';
const nameLetters = Array.from(birthdayName.normalize('NFC').toUpperCase())
	.filter(function(character) {
		return /^\p{L}$/u.test(character);
	});

if (nameLetters.length === 0) {
	throw new Error('birthdayName must contain at least one letter.');
}

$(window).load(function() {
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});

$(document).ready(function() {
	const $balloonArea = $('.birthday-balloons');
	let balloonsFlying = false;
	let balloonsArranged = false;

	$('.birthday-name').text(birthdayName.trim());
	$balloonArea.attr('aria-label', 'Birthday name: ' + birthdayName.trim());

	nameLetters.forEach(function(letter, index) {
		const balloonNumber = (index % 5) + 1;
		const $balloon = $('<div>', {
			class: 'balloons birthday-balloon text-center',
			role: 'img',
			'aria-label': letter
		}).css('background-image', "url('b" + balloonNumber + ".png')");

		$('<h2>').text(letter).appendTo($balloon);
		$balloon.appendTo($balloonArea);
	});

	const $nameBalloons = $balloonArea.find('.birthday-balloon');

	function arrangeBalloons() {
		const availableWidth = Math.max(240, window.innerWidth - 32);
		const columns = Math.min(
			nameLetters.length,
			Math.max(1, Math.floor(availableWidth / 80))
		);
		const gap = 12;
		const balloonWidth = Math.min(100, (availableWidth - gap * (columns - 1)) / columns);
		const balloonHeight = balloonWidth * 1.83;
		const rows = Math.ceil(nameLetters.length / columns);
		const topOffset = Math.max(68, (window.innerHeight - rows * balloonHeight) / 2 - 72);

		$nameBalloons.each(function(index) {
			const row = Math.floor(index / columns);
			const rowStart = row * columns;
			const rowLength = Math.min(columns, nameLetters.length - rowStart);
			const rowWidth = rowLength * balloonWidth + (rowLength - 1) * gap;
			const left = (window.innerWidth - rowWidth) / 2 +
				(index - rowStart) * (balloonWidth + gap);

			$(this).css({
				width: balloonWidth,
				height: balloonHeight,
				backgroundSize: balloonWidth + 'px ' + balloonHeight + 'px'
			}).stop(true).animate({
				top: topOffset + row * (balloonHeight + 16),
				left: left
			}, 700);
		});
	}

	function floatBalloon(balloon) {
		if (!balloonsFlying) {
			return;
		}

		const $balloon = $(balloon);
		const balloonWidth = $balloon.outerWidth();
		const left = Math.random() * Math.max(0, window.innerWidth - balloonWidth);
		const bottom = Math.random() * Math.max(100, window.innerHeight * 0.55);

		$balloon.animate({ left: left, bottom: bottom }, 10000, function() {
			floatBalloon(balloon);
		});
	}

	$(window).on('resize', function() {
		if (balloonsArranged) {
			$nameBalloons.stop(true);
			arrangeBalloons();
		}
	});

	$('#turn_on').click(function() {
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(4700).promise().done(function() {
			$('#play').fadeIn('slow');
		});
	});

	$('#play').click(function() {
		const audio = $('.song')[0];
		if (audio) {
			audio.play();
		}
		$('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(5700).promise().done(function() {
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function() {
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(5700).promise().done(function() {
			$('#balloons_flying').fadeIn('slow');
		});
	});

	$('#balloons_flying').click(function() {
		$('.balloon-border').animate({ top: -500 }, 8000);
		$nameBalloons.each(function(index) {
			$(this).addClass(index % 2 ? 'balloons-rotate-behaviour-two' : 'balloons-rotate-behaviour-one');
			floatBalloon(this);
		});

		$(this).fadeOut('slow').delay(4700).promise().done(function() {
			$('#cake_fadein').fadeIn('slow');
		});
	});

	$('#cake_fadein').click(function() {
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(2700).promise().done(function() {
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function() {
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function() {
			$('#wish_message').fadeIn('slow');
		});
	});

	$('#wish_message').click(function() {
		balloonsFlying = false;
		balloonsArranged = true;
		$nameBalloons.stop(true).css('opacity', 0.95);
		arrangeBalloons();
		$nameBalloons.find('h2').fadeIn(1800);
		$(this).fadeOut('slow').delay(3000).promise().done(function() {
			$('#story').fadeIn('slow');
		});
	});

	$('#story').click(function() {
		$(this).fadeOut('slow');
		$('.cake').fadeOut('fast').promise().done(function() {
			$('.message').fadeIn('slow');
		});

		const $messageLines = $('.message p');
		let lineIndex = 0;
		const messageFadeDuration = 500;

		function showNextMessage() {
			if (lineIndex > 0) {
				$messageLines.eq(lineIndex - 1).fadeOut(messageFadeDuration);
			}
			if (lineIndex < $messageLines.length) {
				$messageLines.eq(lineIndex).fadeIn(messageFadeDuration);
				lineIndex += 1;
				setTimeout(showNextMessage, 1600);
			} else {
				$('.cake').fadeIn('fast');
			}
		}

		showNextMessage();
	});
});
