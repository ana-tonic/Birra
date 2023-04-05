export class Beer {
	constructor(
		ID,
		name,
		tagline,
		first_brewed,
		description,
		food_pairing,
		price,
		brewers_tips,
		image
	) {
		this.ID = ID;
		this.name = name;
		this.tagline = tagline;
		this.first_brewed = first_brewed;
		this.description = description;
		this.food_pairing = food_pairing;
		this.price = price;
		this.brewers_tips = brewers_tips;
		this.image = image;
		this.container = null;
	}

	drawBeer(host) {
		this.container = document.createElement("div");
		this.container.className = "card border-0 rounded-0";
		this.container.id = "id" + this.ID;
		host.appendChild(this.container);

		let cardBody = document.createElement("div");
		cardBody.className =
			"card-body position-relative d-flex flex-column align-items-center";
		this.container.appendChild(cardBody);

		let image = document.createElement("img");
		image.src = this.image;
		cardBody.appendChild(image);

		let price = document.createElement("div");
		price.className = "price";
		price.innerHTML = "$" + this.price;
		cardBody.appendChild(price);

		let cardFooter = document.createElement("div");
		cardFooter.className =
			"card-footer d-flex flex-column justify-content-center text-center border-0 rounded-0";
		cardFooter.innerHTML = "ADD TO CART";
		this.container.appendChild(cardFooter);

		let overlay = document.createElement("div");
		overlay.className =
			"overlay position-absolute d-flex justify-content-center align-items-center";
		this.container.appendChild(overlay);

		let iconHandler = document.createElement("i");
		iconHandler.className = "icon-handler fa-solid fa-link fa-2xl";
		iconHandler.setAttribute("data-bs-toggle", "modal");
		iconHandler.setAttribute("data-bs-target", "#exampleModal" + this.ID);
		overlay.appendChild(iconHandler);

		this.drawModal(document.querySelector(".main__body"));

		return this.container;
	}

	drawModal(host) {
		let modalComponent = document.createElement("div");
		modalComponent.className = "modal fade";
		modalComponent.id = "exampleModal" + this.ID;
		modalComponent.tabIndex = "-1";
		modalComponent.setAttribute("aria-labelledby", "exampleModalLabel");
		modalComponent.ariaHidden = "true";
		host.appendChild(modalComponent);

		let modalDialog = document.createElement("div");
		modalDialog.className = "modal-dialog modal-dialog-centered modal-lg";
		modalComponent.appendChild(modalDialog);

		let modalContent = document.createElement("div");
		modalContent.className = "modal-content";
		modalDialog.appendChild(modalContent);

		let modalHeader = document.createElement("modal-header");
		modalHeader.className = "modal-header d-flex justify-content-between";
		modalContent.appendChild(modalHeader);

		let title = document.createElement("h4");
		title.className = "modal-title";
		title.id = "exampleModalLabel";
		title.innerHTML = this.name;
		modalHeader.appendChild(title);

		let tagline = document.createElement("h6");
		tagline.className = "modal-tagline";
		tagline.innerHTML = this.tagline;
		modalHeader.appendChild(tagline);

		let modalBody = document.createElement("div");
		modalBody.className = "modal-body";
		modalContent.appendChild(modalBody);

		this.drawModalPart(
			modalBody,
			"With us since: ",
			this.first_brewed[1] + "/" + this.first_brewed[0],
			this.description
		);

		let food_pairing = "";
		this.food_pairing.map((food) => {
			food_pairing += food + ", ";
		});
		food_pairing = food_pairing.slice(0, -2);

		this.drawModalPart(modalBody, "It goes great with:", "", food_pairing);

		this.drawModalFooter(modalContent);
	}

	drawModalPart(host, title, subtitle, desc) {
		let modalPart = document.createElement("div");
		modalPart.className = "modal-part";
		host.appendChild(modalPart);

		let withUs = document.createElement("span");
		withUs.innerHTML = title;
		modalPart.appendChild(withUs);

		modalPart.innerHTML += subtitle;

		let description = document.createElement("div");
		description.className = "description";
		description.innerHTML = desc;
		host.appendChild(description);
	}

	drawModalFooter(host) {
		let modalFooter = document.createElement("div");
		modalFooter.className =
			"modal-footer d-flex flex-nowrap justify-content-start align-items-start pb-0";
		host.appendChild(modalFooter);

		let abvContainer = document.createElement("div");
		abvContainer.className = "abv";
		modalFooter.appendChild(abvContainer);

		let abv = document.createElement("span");
		abv.innerHTML = "Abv: ";
		abvContainer.appendChild(abv);

		abvContainer.innerHTML += this.price;

		let tipContainer = document.createElement("div");
		tipContainer.className = "tip";
		modalFooter.appendChild(tipContainer);

		this.drawModalPart(tipContainer, "And our tip: ", this.brewers_tips, "");
	}
}
