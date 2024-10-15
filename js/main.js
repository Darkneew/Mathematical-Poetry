window.onload = () => {
	class Details {
		constructor() {
			this.DOM = {};

			const detailsTmpl = `
			<div class="details__bg details__bg--down">
				<button class="details__close"><i class="fas fa-2x fa-times icon--cross tm-fa-close"></i></button>
				<div class="details__description"></div>
			</div>						
			`;

			this.DOM.details = document.createElement('div');
			this.DOM.details.className = 'details';
			this.DOM.details.innerHTML = detailsTmpl;
			// DOM.content.appendChild(this.DOM.details);
			document.getElementById('tm-wrap').appendChild(this.DOM.details);
			this.init();
		}
		init() {
			this.DOM.bgDown = this.DOM.details.querySelector('.details__bg--down');
			this.DOM.description = this.DOM.details.querySelector('.details__description');
			this.DOM.close = this.DOM.details.querySelector('.details__close');

			this.initEvents();
		}
		initEvents() {
			// close page when outside of page is clicked.
			document.body.addEventListener('click', () => this.close());
			// prevent close page when inside of page is clicked.
			this.DOM.bgDown.addEventListener('click', function(event) {
							event.stopPropagation();
						});
			// close page when cross button is clicked.
			this.DOM.close.addEventListener('click', () => this.close());
		}
		fill(info) {
			// fill current page info
			this.DOM.description.innerHTML = info.description;
		}		
		getProductDetailsRect(){
			var p = 0;
			var d = 0;

			try {
				p = this.DOM.productBg.getBoundingClientRect();
				d = this.DOM.bgDown.getBoundingClientRect();	
			}
			catch(e){}

			return {
				productBgRect: p,
				detailsBgRect: d
			};
		}
		open(data) {
			if(this.isAnimating) return false;
			this.isAnimating = true;

			this.DOM.details.style.display = 'block';  

			this.DOM.details.classList.add('details--open');

			this.DOM.productBg = data.productBg;

			this.DOM.productBg.style.opacity = 0;

			const rect = this.getProductDetailsRect();

			this.DOM.bgDown.style.transform = `translateX(${rect.productBgRect.left-rect.detailsBgRect.left}px) translateY(${rect.productBgRect.top-rect.detailsBgRect.top}px) scaleX(${rect.productBgRect.width/rect.detailsBgRect.width}) scaleY(${rect.productBgRect.height/rect.detailsBgRect.height})`;
            this.DOM.bgDown.style.opacity = 1;
			this.DOM.bgDown.style.maxHeight = "calc(100vh - 30px)";
			this.DOM.description.style.maxHeight = "calc(100vh - 140px)";

            // animate background
            anime({
                targets: [this.DOM.bgDown],
                duration: (target, index) => index ? 800 : 250,
                easing: (target, index) => index ? 'easeOutElastic' : 'easeOutSine',
                elasticity: 250,
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1,                              
                complete: () => this.isAnimating = false
            });

            // animate content
            anime({
                targets: [this.DOM.description],
                duration: 1000,
                easing: 'easeOutExpo',                
                translateY: ['100%',0],
                opacity: 1
            });

            // animate close button
            anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: ['100%',0],
                opacity: 1
            });

            this.setCarousel();

            window.addEventListener("resize", this.setCarousel);
		}
		close() {
			
			if(this.isAnimating) return false;
			this.isAnimating = true;

			this.DOM.details.classList.remove('details--open');

			anime({
                targets: this.DOM.close,
                duration: 250,
                easing: 'easeOutSine',
                translateY: '100%',
                opacity: 0
            });

            anime({
                targets: [this.DOM.description],
                duration: 20,
                easing: 'linear',
                opacity: 0
            });

            const rect = this.getProductDetailsRect();
            anime({
                targets: [this.DOM.bgDown],
                duration: 250,
                easing: 'easeOutSine',                
                translateX: (target, index) => {
                    return index ? rect.productImgRect.left-rect.detailsImgRect.left : rect.productBgRect.left-rect.detailsBgRect.left;
                },
                translateY: (target, index) => {
                    return index ? rect.productImgRect.top-rect.detailsImgRect.top : rect.productBgRect.top-rect.detailsBgRect.top;
                },
                scaleX: (target, index) => {
                    return index ? rect.productImgRect.width/rect.detailsImgRect.width : rect.productBgRect.width/rect.detailsBgRect.width;
                },
                scaleY: (target, index) => {
                    return index ? rect.productImgRect.height/rect.detailsImgRect.height : rect.productBgRect.height/rect.detailsBgRect.height;
                },
                complete: () => {
                    this.DOM.bgDown.style.opacity = 0;
                    this.DOM.bgDown.style.transform = 'none';
                    this.DOM.productBg.style.opacity = 1;
                    this.DOM.details.style.display = 'none';                    
                    this.isAnimating = false;
                }
            });
		}
		// Slick Carousel
        setCarousel() {
	        var slider = $('.details .tm-img-slider');

	        if(slider.length) { // check if slider exist

		        if (slider.hasClass('slick-initialized')) {
		            slider.slick('destroy');
		        }

		        if($(window).width() > 767){
		            // Slick carousel
		            slider.slick({
		                dots: true,
		                infinite: true,
		                slidesToShow: 1,
		                slidesToScroll: 1
		            });
		        }
		        else {
		            slider.slick({
			            dots: true,
			            infinite: true,
			            slidesToShow: 1,
			            slidesToScroll: 1
		        	});
		     	}	
	        }          
        }
	}; // class Details

	class Item {
		constructor(el) {
			this.DOM = {};
			this.DOM.el = el;
			this.DOM.product = this.DOM.el.querySelector('.product');
			this.DOM.productBg = this.DOM.product.querySelector('.product__bg');

			this.info = {
				description: this.DOM.product.querySelector('.product__description').innerHTML
			};

			this.initEvents();
		}
		initEvents() {
			this.DOM.product.addEventListener('click', () => this.open());
		}
		open() {
			DOM.details.fill(this.info);
			DOM.details.open({
				productBg: this.DOM.productBg
			});
		}
	}; // class Item

	const DOM = {};
	DOM.grid = document.querySelector('.grid');
	DOM.content = DOM.grid.parentNode;
	DOM.gridItems = Array.from(DOM.grid.querySelectorAll('.grid__item'));
	let items = [];
	DOM.gridItems.forEach(item => items.push(new Item(item)));

	DOM.details = new Details();	

	load();
};

function load () {
	let img1 = new Image;
	img1.src = "./img/U1_en.png";
	img1.onload = () => {
		let img2 = new Image;
		img2.src = "./img/bg.jpg";
		img2.onload = () => {
			document.getElementById("tm-bg").style.backgroundImage = "url(./img/bg.jpg)"
		}
	}
}

function translator (num, translated) {
	for (e of document.getElementsByClassName(`poem${num}`)) e.innerHTML = POEMS[num][translated? "original": "translated"];
};

function reveal(num, translated) {
	// check if translated or not 
	for (e of document.getElementsByClassName(`ref${num}`)) {
		e.href=POEMS[num][translated? "ref-translated" : "ref"];
		e.onclick = null;
		e.innerHTML = `<i class="fas fa-regular fa-lightbulb"></i> &ensp; ${POEMS[num][translated? "ref-text-translated" : "ref-text"]}`
	}
};

const POEMS = [
	{
		"original": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(0, false)">Translate</button> <br/>  \
			Un point pour l\'espace <br/> \
			On aura beau lancer le lasso hélas <br/> \
			Sans anse pour se raccrocher, <br/> \
			Son destin est déjà noué <br/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Anonymous, Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref0" onclick="reveal(0, false); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
		"translated": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(0, true)">See Original</button> <br/>  \
			A point as a space <br/> \
			We will try to send the lace <br/> \
			But without rugosity, <br/> \
			It cannot escape its destiny <br/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Anonymous, Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-language fa-solid"></i> &ensp;Anonymous, Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref0" onclick="reveal(0, true); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
			"ref": "https://fr.wikipedia.org/wiki/Groupe_fondamental",
			"ref-text": "π<sub>1</sub>",
			"ref-translated": "https://en.wikipedia.org/wiki/Fundamental_group",
			"ref-text-translated": "π<sub>1</sub>"
	}, 
	{
		"original": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(1, false)">Translate</button> <br/> \
			N\'y eut d\'abord rien  <br/> \
			Une toile vide <br/> \
			Un tout tordu <br/> \
			Une géométrie déformée <br/> \
			Alors  <br/> \
			Il créa l\'univers <br/> \
			<br/> \
			L\'univers s\'étendait  <br/> \
			D\'un bout à l\'autre <br/> \
			C\'était la corde <br/> \
			<br/> \
			La corde était informe <br/> \
			Il lui fallait énergie  <br/> \
			<br/> \
			Énergétique cependant  <br/> \
			la corde se secouait <br/> \
			Imprimait monts et vallées  <br/> \
			sur la corde-univers mesurée  <br/> \
			Alors <br/> \
			Il appela chaque secousse "particule"  <br/> \
			<br/> \
			Particules se déplaçant sur la corde <br/> \
			Il sépara celles allant de gauche  <br/> \
			De celles allant de droite <br/> \
			Et la direction fut  <br/> \
			Le début d\'une ségrégation <br/> \
			irréconciliable. <br/> \
			<br/> \
			Mais il voulut aussi <br/> \
			Souligner la courbure du tout <br/> \
			En ces termes <br/> \
			"Qu\'une direction soit  <br/> \
			Dans la géométrie déformée" <br/> \
			&emsp;Et ce fut ainsi. <br/> \
			<br/> \
			Direction de particule sur la corde <br/> \
			Et direction de corde sur la toile <br/> \
			Furent contraintes l\'une à l\'autre  <br/> \
			Jointure des directions  <br/> \
			En une topologie à deux étages <br/> \
			&emsp;Et l\'univers s\'en trouva réduit <br/> \
			<br/> \
			Il vit tout ce qu\'il avait fait  <br/> \
			&emsp;Et voici: c\'était très bon <br/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref1" onclick="reveal(1, false); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
		"translated": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(1, true)">See Original</button> <br/> \
			None were there at first <br/> \
			An empty canvas <br/> \
			A distorted whole <br/> \
			A crooked geometry <br/> \
			Hence <br/> \
			He created the world <br/> \
			<br/> \
			The world spanned  <br/> \
			From one end to the other <br/> \
			It was the string <br/> \
			<br/> \
			The string was formless <br/> \
			It was in need of energy <br/> \
			<br/> \
			Energetic nethertheless  <br/> \
			the string jolted itself  <br/> \
			Printing valleys and hills <br/> \
			on the gauged worldstring <br/> \
			Hence  <br/> \
			He called each jolt "Particle" <br/> \
			<br/> \
			Particles moving on the string <br/> \
			He separated those going by the left  <br/> \
			From those going by the right <br/> \
			And there was direction  <br/> \
			Towards a new segregation <br/> \
			beyond repair. <br/> \
			<br/> \
			But he also desired to  <br/> \
			Emphasize the whole curvature <br/> \
			In these words <br/> \
			"Let there be a direction <br/> \
			In the crooked geometry" <br/> \
			&emsp;And it was so. <br/> \
			<br/> \
			Direction of the particle on the string <br/> \
			And direction of the string on the canvas <br/> \
			Were constrained one to the other  <br/> \
			Conjunction of directions <br/> \
			In a two-storey topology <br/> \
			&emsp;And the world became reduced <br/> \
			<br/> \
			He saw everything that he had made <br/> \
			&emsp;And indeed: it was very good <br/> \
			<br/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-language fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref1" onclick="reveal(1, true); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
			"ref": "https://en.wikipedia.org/wiki/Toda_field_theory",
			"ref-text": "Théorie des champs de Toda",
			"ref-translated": "https://en.wikipedia.org/wiki/Toda_field_theory",
			"ref-text-translated": "Toda field theory"
	},
	{
		"original": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(2, false)">Translate</button> <br/>  \
			<u>Scène 1.</u><br/> \
			Lâché d\'un coup<br/> \
			À l\'origine des temps<br/> \
			Commence la descente <br/> \
			<br/> \
			<u>Scène 2.</u><br/> \
			La pieuvre monégasque déjà <br/> \
			File à toute allure<br/> \
			Pourvu que la pente soit rude<br/> \
			..<br/> \
			Il lui arrive bien de faire vieux os <br/> \
			Dans quelques vallons numériques <br/> \
			Voir de se coincer<br/> \
			Dans un lac de stabilité  <br/> \
			Mais avec assez de vitesse <br/> \
			Rien ne l\'arrête<br/> \
			<br/> \
			Ça fait alors le yoyo<br/> \
			C\'est rigolo<br/> \
			<br/> \
			<u>Scène 3.</u><br/> \
			Prenez cependant garde de la vitesse <br/> \
			Car si par mégarde tu manques l\'arrêt <br/> \
			Alors des milliers de pas peut être <br/> \
			Seront nécessaires pour revenir en arrière <br/> \
			<br/> \
			Pire encore,<br/> \
			Tu risquerais plus haut<br/> \
			De t\'arrêter sur un plateau<br/> \
			<br/> \
			<u>Scène 4.</u><br/> \
			Alors les statisticiens statistiquent <br/> \
			Et d\'appareils surtechnologisés<br/> \
			Ils équipent la machine<br/> \
			Réglés sur plus que mesure <br/> \
			Pour ne pas manquer <br/> \
			L\'arrêt \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref2" onclick="reveal(2, false); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
		"translated": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(2, true)">See Original</button> <br/>  \
			<u>Scene 1.</u> <br/> \
			Dropped at once <br/> \
			At the beginning of time <br/> \
			Starts the descent <br/> \
			<br/> \
			<u>Scene 2.</u> <br/> \
			The Monegasquid already  <br/> \
			Flies in a rush <br/> \
			As long as the slope is harsh <br/> \
			.. <br/> \
			It can fairly well sometimes linger  <br/> \
			In some numerical valley <br/> \
			Or even get stuck <br/> \
			In a lake of stability <br/> \
			But with enough speed <br/> \
			Nothing can stop it <br/> \
			<br/> \
			It then starts yo-yoing <br/> \
			It\'s very amusing <br/> \
			<br/> \
			<u>Scene 3.</u> <br/> \
			Although beware of speed as <br/> \
			If by mistake you miss the stop <br/> \
			Then millions of steps maybe  <br/> \
			Will be needed to go back there <br/> \
			<br/> \
			Worse still, <br/> \
			You could up above <br/> \
			Stop in some alcove <br/> \
			<br/> \
			<u>Scene 4.</u> <br/> \
			Thus the statisticians statisticize <br/> \
			And of overtechnologized devices <br/> \
			They equip the machine <br/> \
			Tuned to more than measure <br/> \
			As not to miss the  <br/> \
			Stop <br/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-language fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref2" onclick="reveal(2, true); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
			"ref": "https://fr.wikipedia.org/wiki/Algorithme_du_gradient",
			"ref-text": "Descente de gradient",
			"ref-translated": "https://en.wikipedia.org/wiki/Gradient_descent",
			"ref-text-translated": "Gradient descent"
	},
	{
		"original": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(3, false)">Translate</button> <br/> \
			<img class="detail-img" src="./img/U1_fr.png" alt="poem"/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref3" onclick="reveal(3, false); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
		"translated": '<button class="col-2 mb-4"></button><button class="col-8 mb-4 translate-button" onclick="translator(3, true)">See Original</button> <br/> \
			<img class="detail-img" src="./img/U1_en.png" alt="poem"/> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-user fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><span class="p-2"><i class="fas fa-language fa-solid"></i> &ensp;Leo Buisine</span></button> \
			<button class="col-12" style="text-align: right;"><a href="#" target="_blank" rel="noopener noreferrer" class="p-1 pl-2 pr-2 mathref ref3" onclick="reveal(3, true); return false;"><i class="fas fa-regular fa-lightbulb"></i> &ensp;&ensp;&ensp; ?&ensp;&ensp;</a></button>',
		"ref": "https://fr.wikipedia.org/wiki/Groupe_unitaire",
		"ref-text": "U(1)",
		"ref-translated": "https://en.wikipedia.org/wiki/Unitary_group",
		"ref-text-translated": "U(1)"
	}
]