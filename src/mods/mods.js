const btnMenu = Array.from(document.querySelectorAll('.button'));

btnMenu.forEach((btns) => {
    btns.addEventListener('click', () => {
        btnMenu.forEach((btns) => {
            btns.classList.remove('selected');
        });
        btns.classList.add('selected');
    });
});

// Cooler buttons
class CustomSelect {
    constructor(originalSelect) {
        this.originalSelect = originalSelect;
        this.customSelect = document.createElement("div");
        this.customSelect.classList.add("select");
        
        // Make a button for each "option" added in the html
        this.originalSelect.querySelectorAll("option").forEach((optionElement) => {
            // Make the div
            const itemElement = document.createElement("div");
            
            // Make the buttons
            itemElement.classList.add("select-item");
            itemElement.textContent = optionElement.textContent;
            this.customSelect.appendChild(itemElement);
  
            itemElement.addEventListener("click", () => {
            // If the button is selected, deselect it on click
            if (this.originalSelect.multiple && itemElement.classList.contains("select-item--selected")) {
                this._deselect(itemElement);
            } 
            
            // Otherwise select it
            else {
                this._select(itemElement);
            }
            });
        });
        
        // Put the div after the multiselect thingy
        this.originalSelect.insertAdjacentElement("afterend", this.customSelect);
        // Removes the weird multiselect thing from view
        this.originalSelect.style.display = "none";
    }
    
    // 
    _select(itemElement) {
        // Find the index of itemElement passed in
        const index = Array.from(this.customSelect.children).indexOf(itemElement);
        
        // Select the item at the index
        // and make the CSS happen to make it look selected
        this.originalSelect.querySelectorAll("option")[index].selected = true;
        itemElement.classList.add("select-item--selected");
    }
  
    _deselect(itemElement) {
        // Find the index of itemElement passed in
        const index = Array.from(this.customSelect.children).indexOf(itemElement);
        
        // Deselect the item at the index
        // and remove the selected CSS
        this.originalSelect.querySelectorAll("option")[index].selected = false;
        itemElement.classList.remove("select-item--selected");
    }
}

// Call it!
document.querySelectorAll(".custom-select").forEach((selectElement) => {
    new CustomSelect(selectElement);
});
  