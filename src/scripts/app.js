import { Beer } from "/src/scripts/beer.js";

// #region variables

const allProducts = [];
let currentProducts = [];
const radioButtons = [];
radioButtons.push(document.querySelector("#chicken"));
radioButtons.push(document.querySelector("#cake"));
radioButtons.push(document.querySelector("#cheese"));
radioButtons.push(document.querySelector("#salad"));
const dateNow = new Date();
const zeroDate = new Date(0);
let abvMin = 0,
	abvMax = 0,
	minDate = [dateNow.getFullYear(), dateNow.getMonth() + 1],
	maxDate = [zeroDate.getFullYear(), zeroDate.getMonth() + 1];
let radioButtonId = "";
let inputLeftSlider = document.getElementById("input-left-abv");
let inputRightSlider = document.getElementById("input-right-abv");
let monthPickerAfter = document.getElementById("startDate");
let monthPickerBefore = document.getElementById("brewedBeforeDate");

//#endregion

// #region fetch

fetch("https://api.punkapi.com/v2/beers?page=1&per_page=10").then((p) => {
	p.json()
		.then((data) => {
			data.forEach((product) => {
				let first_brewed = product.first_brewed.split("/");
				first_brewed.reverse();

				let beer = new Beer(
					product.id,
					product.name,
					product.tagline,
					first_brewed,
					product.description,
					product.food_pairing,
					product.abv,
					product.brewers_tips,
					product.image_url
				);
				allProducts.push(beer);
			});
		})
		.then(() => {
			document.querySelector(".spinner").classList.add("visually-hidden");
			allProducts.forEach((product) => {
				currentProducts.push(
					product.drawBeer(document.querySelector(".products-grid"))
				);
				if (product.price > abvMax) abvMax = product.price;
				if (product.price < abvMin) abvMin = product.price;

				if (
					product.first_brewed[0] < minDate[0] ||
					(product.first_brewed[0] == minDate[0] &&
						product.first_brewed[1] < minDate[1])
				) {
					minDate[0] = product.first_brewed[0];
					minDate[1] = product.first_brewed[1];
				}

				if (
					product.first_brewed[0] > maxDate[0] ||
					(product.first_brewed[0] == maxDate[0] &&
						product.first_brewed[1] < maxDate[1])
				) {
					maxDate[0] = product.first_brewed[0];
					maxDate[1] = product.first_brewed[1];
				}
			});

			minDate = minDate.join("-");
			monthPickerAfter.setAttribute("min", minDate);
			monthPickerBefore.setAttribute("min", minDate);

			maxDate = maxDate.join("-");
			monthPickerAfter.setAttribute("max", maxDate);
			monthPickerBefore.setAttribute("max", maxDate);

			inputLeftSlider.setAttribute("min", abvMin);
			inputLeftSlider.setAttribute("max", parseInt(abvMax + 0.5));
			inputLeftSlider.setAttribute("value", abvMin);

			inputRightSlider.setAttribute("min", abvMin);
			inputRightSlider.setAttribute("max", parseInt(abvMax + 0.5));

			setValueAbv();
			setValueAbv(true);
		});
});

//#endregion

// #region event listeners

document
	.querySelector("#btn-filter-products")
	.addEventListener("click", filterProducts);
document
	.querySelector("#btn-reset-filter")
	.addEventListener("click", resetProducts);
radioButtons.forEach((button) => button.addEventListener("click", saveID));
inputLeftSlider.addEventListener("input", () => {
	setValueAbv(false);
});
inputRightSlider.addEventListener("input", () => {
	setValueAbv(true);
});

// #endregion

// #region filtering functions

async function filterProducts() {
	currentProducts.forEach((product) => {
		product.parentElement.removeChild(product);
	});
	currentProducts = [];
	const nameInput = document.querySelector(".name-input").value;
	document.querySelector(".spinner").classList.remove("visually-hidden");

	await new Promise((r) => setTimeout(r, 2000));

	allProducts.forEach((product) => {
		if (
			// by name
			product.name
				.toLocaleLowerCase()
				.includes(nameInput.toLocaleLowerCase()) &&
			// by food
			filterByFood(product) &&
			// by abv
			product.price <= inputRightSlider.value &&
			product.price >= inputLeftSlider.value &&
			filterByDate(product)
		) {
			currentProducts.push(
				product.drawBeer(document.querySelector(".products-grid"))
			);
		}
	});

	if (currentProducts.length == 0) {
		document.querySelector(".no-elements").classList.remove("no-elements-hide");
	} else {
		document.querySelector(".no-elements").classList.add("no-elements-hide");
	}
	document.querySelector(".spinner").classList.add("visually-hidden");
}

function filterByFood(product) {
	if (radioButtonId == "") return true;

	for (let i = 0; i < product.food_pairing.length; i++) {
		if (product.food_pairing[i].toLocaleLowerCase().includes(radioButtonId))
			return true;
	}

	return false;
}

function filterByDate(product) {
	// preuzeti datume iz inputa
	let afterDate, beforeDate;
	if (monthPickerAfter.value != "")
		afterDate = monthPickerAfter.value.split("-");
	else afterDate = minDate.split("-");
	if (monthPickerBefore.value != "")
		beforeDate = monthPickerBefore.value.split("-");
	else beforeDate = maxDate.split("-");

	if (
		(product.first_brewed[0] > afterDate[0] ||
			(product.first_brewed[0] == afterDate[0] &&
				product.first_brewed[1] >= afterDate[1])) &&
		(product.first_brewed[0] < beforeDate[0] ||
			(product.first_brewed[0] == beforeDate[0] &&
				product.first_brewed[1] <= beforeDate[1]))
	) {
		console.log(product.first_brewed);
		return true;
	} else return false;
}

async function resetProducts() {
	if (!currentProducts.length)
		document.querySelector(".no-elements").classList.add("no-elements-hide");

	currentProducts.forEach((product) => {
		product.parentElement.removeChild(product);
	});
	currentProducts = [];
	document.querySelector(".spinner").classList.remove("visually-hidden");
	await new Promise((r) => setTimeout(r, 2000));
	document.querySelector(".spinner").classList.add("visually-hidden");

	allProducts.forEach((product) => {
		currentProducts.push(
			product.drawBeer(document.querySelector(".products-grid"))
		);
	});

	document.querySelector(".name-input").value = "";
	if (radioButtonId != "") {
		document.querySelector("#" + radioButtonId).checked = false;
		radioButtonId = "";
	}
	inputLeftSlider.value = abvMin;
	inputRightSlider.value = parseInt(abvMax + 0.5);
	setValueAbv(false);
	setValueAbv(true);
	document.getElementById("from-lbl").innerHTML = "From: " + abvMin;
	document.getElementById("to-lbl").innerHTML = "To: " + parseInt(abvMax + 0.5);
	monthPickerAfter.value = monthPickerBefore.value = "";
}

function saveID() {
	radioButtonId = this.id;
}

function setValueAbv(right) {
	let thumbLeft = document.querySelector(".slider > .thumb.left");
	let thumbRight = document.querySelector(".slider > .thumb.right");
	let range = document.querySelector(".slider > .range");

	let _this;
	if (right) _this = inputRightSlider;
	else _this = inputLeftSlider;

	let min = parseInt(_this.min);
	let max = parseInt(_this.max);

	if (right)
		_this.value = Math.max(
			parseInt(_this.value),
			parseInt(inputLeftSlider.value) + 1
		);
	else
		_this.value = Math.min(
			parseInt(_this.value),
			parseInt(inputRightSlider.value) - 1
		);

	let percent = ((_this.value - min) / (max - min)) * 100;

	if (right) {
		thumbRight.style.right = 100 - percent + "%";
		range.style.right = 100 - percent + "%";
		document.getElementById("to-lbl").innerHTML = "To: " + _this.value;
	} else {
		thumbLeft.style.left = percent + "%";
		range.style.left = percent + "%";
		document.getElementById("from-lbl").innerHTML = "From: " + _this.value;
	}
}

//#endregion

// to top button

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
	if (window.pageYOffset > window.innerHeight) {
		toTop.classList.add("active");
	} else {
		toTop.classList.remove("active");
	}
});
