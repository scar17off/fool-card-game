import React, { useEffect, useRef } from 'react';

function GameCanvas() {
	const canvasRef = useRef(null);
	const cardImages = useRef({});
	const hoveredCardIndex = useRef(-1);
	const testHand = ['A_of_spades', 'K_of_spades'];
	const opponentHand = ['hidden', 'hidden', 'hidden'];
	const playingAreaCards = ['Q_of_spades', '10_of_diamonds', '7_of_clubs', '3_of_spades', 'A_of_hearts', 'K_of_hearts', '9_of_hearts', '8_of_hearts', '6_of_hearts', '5_of_hearts', '4_of_hearts', '2_of_hearts'];

	const REFERENCE_WIDTH = 1920;
	const REFERENCE_HEIGHT = 956;
	const BASE_PLAYING_AREA_SCALE = 0.8;

	
	useEffect(() => {
		const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
		const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

		suits.forEach(suit => {
			values.forEach(value => {
				const img = new Image();
				img.src = `/cards/${value}_of_${suit}.png`;
				cardImages.current[`${value}_of_${suit}`] = img;
			});
		});
	}, []);

	
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			const globalScale = getScaleFactor();
			
			renderBackground(ctx);
			renderPlayingArea(ctx);

			const rightSideX = canvas.width * 0.75;
			renderHand(ctx, opponentHand, rightSideX, 225 * globalScale, 1, false);
			renderHand(ctx, testHand, rightSideX, canvas.height - 225 * globalScale, 1, true);
		}

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		return () => window.removeEventListener('resize', resizeCanvas);
	}, []);

	
	useEffect(() => {
		const canvas = canvasRef.current;

		function handleMouseMove(e) {
			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const globalScale = getScaleFactor();

			const rightSideX = canvas.width * 0.75;
			const playerHandY = canvas.height - 225;
			const scale = globalScale;
			const cardSpacing = 100 * scale;
			const totalWidth = (testHand.length - 1) * cardSpacing;
			const startX = rightSideX - totalWidth / 2;

			const cardWidth = 180 * scale;
			const cardHeight = 380 * scale;

			let newHoveredIndex = -1;

			
			if (mouseY > canvas.height / 2) {
				testHand.forEach((_, index) => {
					const cardX = startX + index * cardSpacing;
					if (
						mouseX > cardX - cardWidth / 2 &&
						mouseX < cardX + cardWidth / 2 &&
						mouseY > playerHandY - cardHeight / 2 &&
						mouseY < playerHandY + cardHeight / 2
					) {
						newHoveredIndex = index;
					}
				});
			}

			if (hoveredCardIndex.current !== newHoveredIndex) {
				hoveredCardIndex.current = newHoveredIndex;
				const ctx = canvas.getContext('2d');
				renderBackground(ctx);
				renderPlayingArea(ctx);
				renderHand(ctx, opponentHand, rightSideX, 225 * globalScale, 1, false);
				renderHand(ctx, testHand, rightSideX, canvas.height - 225 * globalScale, 1, true);
			}
		}

		canvas.addEventListener('mousemove', handleMouseMove);
		return () => canvas.removeEventListener('mousemove', handleMouseMove);
	}, []);

	
	const renderCard = (ctx, cardName, x, y, scale = 1) => {
		if (cardName === 'hidden') {
			renderCardBack(ctx, x, y, scale);
			return;
		}

		const img = cardImages.current[cardName];
		const cardWidth = 180 * scale;
		const cardHeight = 380 * scale;

		if (img && img.complete && img.naturalHeight !== 0) {
			
			ctx.drawImage(img, x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight);
		} else {
			
			ctx.save();
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;

			
			ctx.beginPath();
			ctx.roundRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 10);
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.stroke();

			
			const displayText = cardName.split('_').join(' ');
			ctx.fillStyle = 'black';
			ctx.font = `${20 * scale}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(displayText, x, y);

			ctx.restore();
		}
	};

	
	const renderHand = (ctx, cards, centerX, centerY, scale = 1, isPlayerHand = true) => {
		const globalScale = getScaleFactor();
		scale *= globalScale;
		const baseCardSpacing = 100 * scale;
		const hoveredSpacing = 140 * scale;

		let totalWidth = (cards.length - 1) * baseCardSpacing;
		
		if (isPlayerHand && hoveredCardIndex.current !== -1) {
			totalWidth += hoveredSpacing - baseCardSpacing;
		}

		let startX = centerX - totalWidth / 2;

		
		cards.forEach((card, index) => {
			if (!isPlayerHand || index !== hoveredCardIndex.current) {
				let x = startX;
				for (let i = 0; i < index; i++) {
					x += (isPlayerHand && i === hoveredCardIndex.current) ? hoveredSpacing : baseCardSpacing;
				}
				renderCard(ctx, card, x, centerY, scale);
			}
		});

		
		if (isPlayerHand && hoveredCardIndex.current !== -1) {
			let x = startX;
			for (let i = 0; i < hoveredCardIndex.current; i++) {
				x += i === hoveredCardIndex.current ? hoveredSpacing : baseCardSpacing;
			}
			renderCard(ctx, cards[hoveredCardIndex.current], x, centerY - 20, scale);
		}
	};

	
	const renderBackground = (ctx) => {
		const canvas = canvasRef.current;

		
		const gradient = ctx.createRadialGradient(
			canvas.width / 2, canvas.height / 2, 10,
			canvas.width / 2, canvas.height / 2, canvas.height
		);

		gradient.addColorStop(0, '#2d572c');
		gradient.addColorStop(1, '#153714');

		
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		
		ctx.fillStyle = '#1a3319';
		const patternSize = 20;

		for (let x = 0; x < canvas.width; x += patternSize) {
			for (let y = 0; y < canvas.height; y += patternSize) {
				if ((x + y) % (patternSize * 2) === 0) {
					ctx.fillRect(x, y, patternSize, patternSize);
				}
			}
		}
	};

	
	const renderCardBack = (ctx, x, y, scale = 1) => {
		const cardWidth = 180 * scale;
		const cardHeight = 380 * scale;

		ctx.save();

		
		ctx.beginPath();
		ctx.roundRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 10);

		
		const gradient = ctx.createLinearGradient(
			x - cardWidth / 2, y - cardHeight / 2,
			x + cardWidth / 2, y + cardHeight / 2
		);
		gradient.addColorStop(0, '#1a237e');
		gradient.addColorStop(1, '#0d47a1');

		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.stroke();

		
		ctx.beginPath();
		const patternSize = 15;
		const margin = 20;

		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.lineWidth = 1;

		
		for (let i = -cardWidth / 2 + margin; i < cardWidth / 2 - margin; i += patternSize) {
			for (let j = -cardHeight / 2 + margin; j < cardHeight / 2 - margin; j += patternSize) {
				ctx.beginPath();
				ctx.moveTo(x + i, y + j - patternSize / 2);
				ctx.lineTo(x + i + patternSize / 2, y + j);
				ctx.lineTo(x + i, y + j + patternSize / 2);
				ctx.lineTo(x + i - patternSize / 2, y + j);
				ctx.closePath();
				ctx.stroke();
			}
		}

		
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.lineWidth = 3;
		ctx.strokeRect(
			x - cardWidth / 2 + margin / 2,
			y - cardHeight / 2 + margin / 2,
			cardWidth - margin,
			cardHeight - margin
		);

		ctx.restore();
	};

	
	const renderPlayingArea = (ctx) => {
		const canvas = canvasRef.current;
		const globalScale = getScaleFactor();
		
		
		const margin = 40 * globalScale;
		const areaWidth = canvas.width * 0.6;
		const areaHeight = canvas.height * 0.7;
		const areaX = margin;
		const areaY = margin;

		
		ctx.save();
		ctx.beginPath();
		ctx.roundRect(
			areaX,
			areaY,
			areaWidth,
			areaHeight,
			20
		);

		
		const gradient = ctx.createLinearGradient(
			areaX,
			areaY,
			areaX + areaWidth,
			areaY + areaHeight
		);
		gradient.addColorStop(0, '#2d572c');
		gradient.addColorStop(1, '#234323');
		ctx.fillStyle = gradient;
		ctx.fill();

		
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.lineWidth = 2;
		ctx.stroke();

		
		const cardScale = BASE_PLAYING_AREA_SCALE * globalScale;
		const cardWidth = 180 * cardScale;
		const cardHeight = 360 * cardScale;
		const cardsPerRow = 6;
		const horizontalSpacing = cardWidth * 1.1; 
		const verticalSpacing = cardHeight * 1.1; 
		
		
		const padding = 30 * globalScale;
		
		
		const rows = Math.ceil(playingAreaCards.length / cardsPerRow);
		const totalCardsWidth = Math.min(cardsPerRow, playingAreaCards.length) * horizontalSpacing - (horizontalSpacing - cardWidth);
		const totalCardsHeight = rows * verticalSpacing - (verticalSpacing - cardHeight);
		
		
		const startX = areaX + (areaWidth - totalCardsWidth) / 2;
		const startY = areaY + padding;

		
		playingAreaCards.forEach((card, index) => {
			const row = Math.floor(index / cardsPerRow);
			const col = index % cardsPerRow;
			const x = startX + (col * horizontalSpacing) + cardWidth/2;
			const y = startY + (row * verticalSpacing) + cardHeight/2;

			renderCard(ctx, card, x, y, cardScale);
		});
	};

	const getScaleFactor = () => {
		const canvas = canvasRef.current;
		const widthRatio = canvas.width / REFERENCE_WIDTH;
		const heightRatio = canvas.height / REFERENCE_HEIGHT;
		return Math.min(widthRatio, heightRatio);
	};

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			}}
		/>
	);
}

export default GameCanvas; 