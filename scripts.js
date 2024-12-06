// Database of items for development
const products_db = [
    // An array of objects with properties of name, price, categories, imageURL, and id
    {
        name: "Glory Riders",
        price: 23.99,
        categories: ["book", "teen", "fiction", "bestseller", "new", "literature"],
        imageURL: "images/Client3_Book2.png",
        id: "0000000000001"
    },
    {
        name: "Brie Mine 4 Ever",
        price: 10.59,
        categories: ["book", "children", "non-fiction", "bestseller", "new", "literature"],
        imageURL: "images/Client3_Book1.png",
        id: "0000000000002"
    },
    {
        name: "Sorcerer's Shadowed Chronicles",
        price: 37.99,
        categories: ["book", "teen", "adult", "fiction", "bestseller", "literature", "clearance"],
        imageURL: "images/Client3_Book3.png",
        id: "0000000000003"
    },
    {
        name: "Ball - Issue #42",
        price: 6.99,
        categories: ["magazine", "teen", "non-fiction", "literature", "clearance"],
        imageURL: "images/Client3_Magazine1.png",
        id: "0000000000004"
    },
    {
        name: "Ball - Issue #43",
        price: 6.99,
        categories: ["magazine", "teen", "non-fiction", "bestseller", "literature"],
        imageURL: "images/Client3_Magazine1.png",
        id: "0000000000005"
    },
    {
        name: "Ball - Issue #48",
        price: 6.99,
        categories: ["magazine", "teen", "non-fiction", "new", "literature"],
        imageURL: "images/Client3_Magazine1.png",
        id: "0000000000006"
    },
    {
        name: "Travel - Issue #56",
        price: 6.99,
        categories: ["magazine", "teen", "adult", "non-fiction", "new", "literature"],
        imageURL: "images/Client3_Magazine2.png",
        id: "0000000000007"
    },
    {
        name: "Eat. - Issue #92",
        price: 6.99,
        categories: ["magazine", "teen", "adult", "non-fiction", "new", "literature"],
        imageURL: "images/Client3_Magazine3.png",
        id: "0000000000008"
    },
    {
        name: "Bookhaven Bookstore Branded Notebook",
        price: 3.99,
        categories: ["notebook", "bestseller", "non-literature"],
        imageURL: "images/Client3_Notebook.png",
        id: "0000000000009"
    },
    {
        name: "Bookhaven Bookstore Sticker Assortment",
        price: 1.99,
        categories: ["misc", "new", "non-literature"],
        imageURL: "images/Client3_Stickers.png",
        id: "0000000000010"
    },
    {
        name: '"Read Read Read" Totebag',
        price: 5.99,
        categories: ["misc", "bestseller", "non-literature", "clearance"],
        imageURL: "images/Client3_ToteBag.png",
        id: "0000000000011"
    }
];

// Store the username and password (only to emulate a database)
const userPass = ["sumone@mail.domain.com", "300k#@veN!"];

// Track the number of itemCards
let itemCardCnt = 0;

// -- Control Elements -- //
// active page
const currentPage = document.getElementsByClassName("active-page")[0].getAttribute("href");
const pageBody = document.getElementById("page-body");
// nav menu
const menuButtonWrap = document.querySelector("#site-nav-menu-button");
const menuBtn = document.querySelector("#site-nav-menu-btn");
const siteNavMenu = document.querySelector("#site-nav-menu");
// search and newsletter
const searchCategory = document.getElementById("search-category");
const newsletterSignup = document.getElementById("newsletter-signup-btn");
// signin window
const navSignInBtn = document.getElementById("nav-signin-btn");
const signinWndWrap = document.getElementById("signin-wnd-wrap");
const signinCloseBtn = document.getElementById("signin-wnd-close-btn");
const signInForm = document.getElementById("signin-form");
// cart window
const galViewCartBtn = document.getElementById("gal-vc-btn");
const navViewCartBtn = document.getElementById("nav-view-cart-btn");
const shoppingCartWnd = document.getElementById("shopping-cart");
const shoppingCartItems = document.getElementById("cart-contents");
const shoppingCartCloseBtn = document.getElementById("cart-close-btn");
// dynamic containers
const newArrivalsCont = document.getElementById("na-carousel");
const bestSellersCont = document.getElementById("bs-carousel");
const galleryCont = document.getElementById("gallery");
const contactForm = document.getElementById("contact-form");


// -- Shuffle Array (Fisher-Yates Shuffle)
const shuffleArr = (arr) => {
    let m = arr.length, t, i;

    // While elements remain to be shuffled
    while(m) {
        // Pick a random remaining element
        i = Math.floor(Math.random() * m--);

        // Swap it with the current element
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }

    return arr;
};

// -- Capture the URL Parameters
const checkURLForParams = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const category = params.get("category");

    if(category) return category;
    return null;
};

// -- Update the URL to reflect the category changes
const updateSearchURL = (param, paramValue) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set(param, paramValue);
    window.history.replaceState({}, '', `${url.pathname}?${params}`);
};

// -- Fetch Shopping Cart Data from sessionStorage
const fetchCart = () => {
    let cartData = sessionStorage.getItem("cart-items");
    if (cartData) {
        cartData = JSON.parse(cartData);
        return cartData;
    } else {
        return [];
    }
};

// -- Determine if the item is in the cart
const searchCart = (itemID) => {
    const cartData = fetchCart();
    const itemIndex = cartData.findIndex(item => item.id === itemID);
    return itemIndex;
};

// -- Add an item to the cart
const addToCart = (e) => {
    const evoker = document.getElementById(e.target.id);
    const itemID = evoker.getAttribute("data-item-id");
    const cartItemIndex = searchCart(itemID);
    const itemToAdd = products_db.find(prod => prod.id === itemID);
        
    // Fetch existing cart data from sessionStorage (destringify)
    const cartData = fetchCart();
    
    // If item is not in the cart, add it
    if (cartItemIndex == -1) {
        itemToAdd["quantity"] = 1;
        cartData.push(itemToAdd);

    // Else if item is in cart, add 1
    } else {
        cartData[cartItemIndex]["quantity"] = cartData[cartItemIndex]["quantity"] + 1;
    };
   
    // Push the cart data back to the sessionStorage (stringify)
    pushCart(cartData);
    loadCart();

    // If the evoker was an "add to cart" button, display a message
    if (evoker.classList.contains("add-cart-btn")) {
        alert("Item added to the cart: " + itemToAdd["name"]);
    };
};

// -- Remove an item from the cart
const removeFromCart = (e, deCnt = 1) => {
    const itemID = document.getElementById(e.target.id).getAttribute("data-item-id");
    const cartItemIndex = searchCart(itemID);

    // Fetch existing cart data from sessionStorage (destringify)
    let cartData = fetchCart();
    
    // Get the quantity
    const itemCnt = cartData[cartItemIndex]["quantity"];

    // If only 1 is in the cart, remove the item
    if (itemCnt == 1) {
        deCnt = 0;
    }

    switch(deCnt) {
        case 1:
            // Decrease item by 1
            cartData[cartItemIndex]["quantity"] = cartData[cartItemIndex]["quantity"] - 1;
            break;
        case 0:
            // Remove all of item
            cartData.splice(cartItemIndex, 1);
            break;
    }

    // Push the cart data back to the sessionStorage (stringify)
    pushCart(cartData);
    loadCart();
};

// -- Clear the cart
const clearCart = (i = 1) => {
    const cartData = fetchCart();

    if (i !== 0 && cartData.length >= 1) {
        sessionStorage.removeItem("cart-items");
        alert("Cart cleared.");
    } else if (i !== 0) {
        alert("No items to clear.");
    } else {
        sessionStorage.removeItem("cart-items");
    };

    loadCart();
};

// -- Process the order
const processCart = (cartData, cartPrice) => {
    if (cartData && cartData.length >= 1) {
        alert("Thank you for your purchase!\n\nTotal paid: $" + cartPrice.toFixed(2));
        clearCart(0);
    } else {
        alert("Cart is empty.  Add some products before checking out.");
    }
};

// -- Push Shopping Cart Data to sessionStorage
const pushCart = (cartData) => {
    sessionStorage.setItem("cart-items", JSON.stringify(cartData));
};

// -- Load the cart to the page
const loadCart = () => {
    const cartData = fetchCart();
    let itemsCount = 0, cartPrice = 0;

    // Remove all cart object in the DOM
    while(shoppingCartItems.firstChild) {
        shoppingCartItems.removeChild(shoppingCartItems.firstChild);
    }
    
    // Create a new cart
    const cart = document.createElement("table");
    cart.setAttribute("id", "cart-items");

    // If cart data exists, build a table to display
    if(cartData && cartData.length > 0) {
        // Sum the itemQtys and itemPrices for all cart items
        cartData.forEach(item => {
            itemsCount += item.quantity;
            cartPrice += item.price * item.quantity;
        });

        // Build the table headers row
        const headerRow = document.createElement("tr");

        const itemTH = document.createElement("th");
        itemTH.appendChild(document.createTextNode("Item"));

        const qtyTH = document.createElement("th");
        qtyTH.appendChild(document.createTextNode("Quantity"));

        const unitPriceTH = document.createElement("th");
        unitPriceTH.classList.add("text-right");
        unitPriceTH.appendChild(document.createTextNode("Unit Price"));

        const priceTH = document.createElement("th");
        priceTH.classList.add("text-right");
        priceTH.appendChild(document.createTextNode("Price"));

        headerRow.appendChild(itemTH);
        headerRow.appendChild(qtyTH);
        headerRow.appendChild(unitPriceTH);
        headerRow.appendChild(priceTH);

        cart.appendChild(headerRow);
        
        // Add the cart items to the cart table
        cartData.forEach((item, i) => {
            // Create a new item row
            const itemRow = document.createElement("tr");
            
            // Create an itemName cell
            const itemNameTD = document.createElement("td");
            const itemName = document.createTextNode(item.name);
            itemNameTD.classList.add("text-left");
            itemNameTD.appendChild(itemName);

            // Create a itemQuantity cell
            const itemQtyTD = document.createElement("td");

            // Create a button to remove item from cart
            const itemDelBtn = document.createElement("i");
            itemDelBtn.setAttribute("id", "item-del-btn-" + item.id);
            itemDelBtn.setAttribute("data-item-id", item.id);
            itemDelBtn.setAttribute("title", "Click to remove item");
            itemDelBtn.classList.add("cart-item-btn", "item-del-btn", "fa-regular", "fa-trash-can");
            itemDelBtn.addEventListener('click', (e) => {
                removeFromCart(e, 0);
            });
            
            // Create a button to decrease item quantity in cart
            const itemDecBtn = document.createElement("button");
            itemDecBtn.appendChild(document.createTextNode("-"));
            itemDecBtn.setAttribute("id", "item-dec-btn-" + item.id);
            itemDecBtn.setAttribute("data-item-id", item.id);
            itemDecBtn.setAttribute("title", "Click to decrease quantity");
            itemDecBtn.classList.add("cart-item-btn", "item-dec-btn", "parchment-bg-color");
            itemDecBtn.addEventListener('click', (e) => {
                removeFromCart(e, 1);
            });

            // Create a button to increase itemQuantity in cart
            const itemIncBtn = document.createElement("button");
            itemIncBtn.appendChild(document.createTextNode("+"));
            itemIncBtn.setAttribute("id", "item-inc-btn-" + item.id);
            itemIncBtn.setAttribute("data-item-id", item.id);
            itemIncBtn.setAttribute("title", "Click to increase quantity");
            itemIncBtn.classList.add("cart-item-btn", "item-inc-btn", "parchment-bg-color");
            itemIncBtn.addEventListener('click', (e) => {
                addToCart(e);
            });

            // Add the buttons and itemQuantity to the cell
            itemQtyTD.classList.add("text-center", "no-wrap");
            itemQtyTD.appendChild(document.createTextNode(item.quantity));
            itemQtyTD.appendChild(document.createElement("br"));
            itemQtyTD.appendChild(itemDelBtn);
            itemQtyTD.appendChild(itemDecBtn);
            itemQtyTD.appendChild(itemIncBtn);

            // Create an itemPrice cell
            const itemPriceTD = document.createElement("td");
            const itemPrice = document.createTextNode('$' + item.price);
            itemPriceTD.classList.add("text-right");
            itemPriceTD.appendChild(itemPrice);

            // Create an itemTotal cell
            const itemTotalTD = document.createElement("td");
            const itemTotal = document.createTextNode('$' + (item.price * item.quantity).toFixed(2));
            itemTotalTD.classList.add("text-right");
            itemTotalTD.appendChild(itemTotal);

            // Add the item's data to the item row
            itemRow.appendChild(itemNameTD);
            itemRow.appendChild(itemQtyTD);
            itemRow.appendChild(itemPriceTD);
            itemRow.appendChild(itemTotalTD);
            
            // Add the item row to the cart table
            cart.appendChild(itemRow);
        });

        // Create a row for totals
        const totalsRow = document.createElement("tr");
        const totalItemsLbl = document.createElement("td");
        const totalPriceLbl = document.createElement("td");
        const totalItemsTD = document.createElement("td");
        const totalPriceTD = document.createElement("td");
        //const totalItemsTxt = document.createTextNode("Items in cart:");
        const totalItems = document.createTextNode(itemsCount);
        const totalPrice = document.createTextNode("$" + cartPrice.toFixed(2));

        totalItemsLbl.classList.add("text-right");
        totalPriceLbl.classList.add("text-right", "rose-color", "lg-font");
        totalItemsTD.classList.add("text-center");
        totalPriceTD.classList.add("text-right", "rose-color", "lg-font");
        totalItemsLbl.appendChild(document.createTextNode("Items in cart "));
        totalPriceLbl.appendChild(document.createTextNode("Subtotal "));
        totalItemsTD.appendChild(totalItems);
        totalPriceTD.appendChild(totalPrice);

        // Add the cells to the row
        totalsRow.appendChild(totalItemsLbl);
        totalsRow.appendChild(totalItemsTD);
        totalsRow.appendChild(totalPriceLbl);
        totalsRow.appendChild(totalPriceTD);

        // Add the totals row to the cart table
        cart.appendChild(totalsRow);
    } else {
        // Create a row to let the user know the cart is empty
        const emptyCartRow = document.createElement("tr");
        const emptyCartTD = document.createElement("td");

        emptyCartTD.setAttribute("colspan", "4");
        emptyCartTD.appendChild(document.createTextNode("Your shopping cart is empty."));
        emptyCartRow.appendChild(emptyCartTD);

        // Add the row to the cart
        cart.appendChild(emptyCartRow);
    };

    // Create a row to clear the cart or check out
    const checkRow = document.createElement("tr");
    const checkOutTD = document.createElement("td");
    
    // Create a Clear Cart Button
    const clearCartBtn = document.createElement("button");
    const clearCartTxt = document.createTextNode("Clear Cart");
    clearCartBtn.setAttribute("id", "clear-cart-btn");
    clearCartBtn.classList.add("parchment-bg-color", "float-left");
    clearCartBtn.appendChild(clearCartTxt);
    clearCartBtn.addEventListener('click', () => {
        clearCart();
    });

    // Create a Check Out Button
    const checkOutBtn = document.createElement("button");
    const checkOutTxt = document.createTextNode("Process Order");
    checkOutBtn.setAttribute("id", "checkout-btn");
    checkOutBtn.classList.add("parchment-bg-color", "float-right");
    checkOutBtn.appendChild(checkOutTxt);
    checkOutBtn.addEventListener('click', () => {
        processCart(cartData, cartPrice);
    });

    // Add the buttons to the cells
    checkOutTD.setAttribute("colSpan", "4");
    checkOutTD.appendChild(clearCartBtn);
    checkOutTD.appendChild(checkOutBtn);

    // Add the cells to the row
    checkRow.appendChild(checkOutTD);

    // Add the check out row to the cart
    cart.appendChild(checkRow);

    // Add the cart to the page
    shoppingCartItems.appendChild(cart);
};

// -- Fetch the appropriate items from the database -- //
const fetchItemCards = (itemCategory) => {
    let products = [];
    products_db.forEach(product => {
        if (itemCategory === "all") {
            products.push(product);
        } else {
            if(product.categories.includes(itemCategory)) {
                products.push(product);
            }
        }
    });
    if (products.length > 0) return products;
    return null;
};

// -- Create the itemCard for the item pulled from the database -- //
const createItemCard = (product) => {
    // make a new card
    const card = document.createElement("div");
    card.classList.add("item-card");

    // add the item name/title
    const itemTitle = document.createElement("span");
    itemTitle.classList.add("medium-font");
    itemTitle.innerText = product.name;
    card.appendChild(itemTitle);

    // add the item image
    const itemImg = document.createElement("img");
    itemImg.classList.add("item-image");
    itemImg.src = product.imageURL;
    itemImg.alt = product.name;
    card.appendChild(itemImg);

    // add the item price
    const itemPrice = document.createElement("span");
    itemPrice.innerText = '$' + product.price;
    card.appendChild(itemPrice);

    // add the add-to-cart button
    const addCartBtn = document.createElement("button");
    addCartBtn.setAttribute("id", "add-cart-btn-" + (itemCardCnt + 1));
    addCartBtn.setAttribute("data-item-id", product.id);
    addCartBtn.setAttribute("title", `Add '${product.name}' to cart`);
    addCartBtn.classList.add("add-cart-btn");
    addCartBtn.innerText = "Add to Cart";
    addCartBtn.addEventListener('click', (e)=> {
        addToCart(e);
    });
    card.appendChild(addCartBtn);

    return card;
};

// -- Load the necessary itemCards -- //
// Calls the item fetch and item card maker functions
const loadItemCards = (itemCategory, caller, searchStr = null) => {
    let errCnt = 0;
    let products = [];

    try {
        products = fetchItemCards(itemCategory);
        if (products) {
            shuffleArr(products);
            caller.innerHTML = "";
            products.forEach(product => {
                caller.appendChild(createItemCard(product));
                itemCardCnt++;
            });
        };
    } catch {
        console.error(`User requested invalid data: ` + itemCategory + `. Stopping.`);
        return null;
    };
};

// -- Detect if user is logged in for the session
const checkLogin = () => {
    let loggedStatus = sessionStorage.getItem("userLoggedIn");
    if (loggedStatus) {
        navSignInBtn.innerText = "Sign Out";
    } else {
        navSignInBtn.innerText = "Sign In";
    }
};


// -- Event Listeners -- //
// Nav Menu Button (present in the site-header of all pages)
menuButtonWrap.addEventListener("click", () => {
    siteNavMenu.classList.toggle("hidden");
    menuButtonWrap.classList.toggle("gold-bg-color");
    menuBtn.classList.toggle("fa-bars");
    menuBtn.classList.toggle("fa-xmark");
});

// Newsletter Signup (present in the site-footer of all pages)
newsletterSignup.addEventListener('click', (e)=> {
    const pForm = newsletterSignup.closest("form");
    if (!pForm.checkValidity()) {
        pForm.reportValidity();
    } else {
        const formData = new FormData(pForm);
        const email = formData.get("newsletter-email");
        pForm.reset();
        alert("Thank you for subscribing!");
    }
});

// Category Filter Change
if(searchCategory) {
    searchCategory.addEventListener('change', (e) => {

        // Change the url's search terms
        updateSearchURL("category", searchCategory.value);

        // Filter the Items by the category
        loadItemCards(searchCategory.value, galleryCont);
    });
};

// Contact Form handlers
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const fName = formData.get("given-name");
        const lName = formData.get("family-name");
        const email = formData.get("email");
        const msg = formData.get("message");
        const custom = formData.get("custom-order");

        localStorage.setItem("contact-info", JSON.stringify({
            firstName: fName,
            lastName: lName,
            uEmail: email,
            uMsg: msg,
            cOrder: custom}));

        contactForm.reset();
        
        if(custom === "true") {
            alert("Thank you for your message, " + fName + ".\n\nA representative will contact you within 1-2 business days.");
        } else {
            alert("Thank you for your message, " + fName + ".");
        }
    });
};


// -- Sign-In Window Listeners
// Sign In Form (present but normally hidden in all pages)
signInForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    const formData = new FormData(signInForm);
    const username = formData.get("user-name");
    const password = formData.get("password");

    // userPass stored at the top of this JavaScript file for simplicity
    if (username === userPass[0] && password === userPass[1]) {
        sessionStorage.setItem("userLoggedIn", "true");
        alert("You have successfully logged in as: " + username);
        signinWndWrap.classList.toggle("hidden");
        checkLogin();
    }
});

// Navigation menu sign in / sign out button
navSignInBtn.addEventListener("click", () => {
    // If user is logged in, log out
    if(sessionStorage.getItem("userLoggedIn") === "true") {
        sessionStorage.removeItem("userLoggedIn");
        clearCart(0);
        alert("You have been signed out!");
        checkLogin();
    } else {
    // Otherwise, show the login window
    signinWndWrap.classList.toggle("hidden");
    }
});

// X button to close Sign-In Window
signinCloseBtn.addEventListener("click", () => {
    signinWndWrap.classList.toggle("hidden");
});


// -- Shopping-Cart Listeners
// View Cart Button (present in all pages)
if (galViewCartBtn) {
    galViewCartBtn.addEventListener("click", () => {
        shoppingCartWnd.classList.toggle("hidden");
    });
};

navViewCartBtn.addEventListener("click", () => {
    shoppingCartWnd.classList.toggle("hidden");
});

// X button to close Shopping-Cart Window
shoppingCartCloseBtn.addEventListener("click", () => {
    shoppingCartWnd.classList.toggle("hidden");
});


// -- Load Page Elements depending on the Page -- //
window.addEventListener("load", () => {
    loadCart();
    checkLogin();
    switch (currentPage) {
        case "index.html":
            loadItemCards("new", newArrivalsCont);
            loadItemCards("bestseller", bestSellersCont);
            break;
        case "gallery.html":
            const paramCheck = checkURLForParams();

            // If no parameters in URL, load all items
            if (paramCheck === null) {
                loadItemCards("all", galleryCont);

            // Else if URL includes a category, load items from category
            } else {
                searchCategory.value = paramCheck;
                loadItemCards(paramCheck, galleryCont);
            };
            break;
        case "events.html":
            // TODO : Add things to load!
            break;
        case "about.html":
            // TODO : Add things to load!
            break;
        default:
            console.error("Unknown page!");
    };
});
