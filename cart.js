 const cart = {};

  document.querySelectorAll(".order-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      const price = parseFloat(button.getAttribute("data-price"));
      const productNameNode = button.parentElement.querySelector("h3");
      const productName = productNameNode ? productNameNode.textContent : "";


      if (!cart[productId]) {
        cart[productId] = {
          quantity: 1,
          price: price,
          name: productName,
        };
      } else {
        cart[productId].quantity++;
      }
      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    const orderItemsElement = document.querySelector(".order-items");
    const orderTotalElement = document.getElementById("order-total");
    orderItemsElement.innerHTML = "";

    let totalPrice = 0;
    for (const productId in cart) {
      const item = cart[productId];
      const itemTotalPrice = item.quantity * item.price;
      totalPrice += itemTotalPrice;

      const orderItemElement = document.createElement("div");
      orderItemElement.classList.add("order-item");
      orderItemElement.innerHTML = `
                                <p><span class="item-name">${item.name}</span> - <span class="item-quantity">${item.quantity}</span> x $<span class="item-price">${item.price}</span> 
                                <button class="remove-button" data-product-id="${productId}">Remove</button></p>
                            `;
      orderItemsElement.appendChild(orderItemElement);

      // Add event listener to remove button
      const removeButton = orderItemElement.querySelector(".remove-button");
      removeButton.addEventListener("click", () => {
        removeFromCart(productId);
      });
    }

    orderTotalElement.textContent = totalPrice;
  }

  function removeFromCart(productId) {
    if (cart[productId]) {
      if (cart[productId].quantity > 1) {
        cart[productId].quantity--;
      } else {
        delete cart[productId];
      }
      updateCartDisplay();
    }
  }

 document
   .getElementById("checkout-button")
   .addEventListener("click", function () {
     // ตรวจสอบข้อมูลลูกค้าและรายการสั่งซื้อ
     var customerName = document.getElementById("customer-name").value;
     var customerPhone = document.getElementById("customer-phone").value;
     var orderDate = document.getElementById("order-date").value;

     if (customerName && customerPhone && orderDate) {
       var orderItems = document.querySelectorAll(".menu-item");
       var items = [];

       // เก็บข้อมูลรายการสั่งซื้อ
       orderItems.forEach(function (item) {
         var itemNameNode = item.querySelector(".order-item h3");
         var itemPriceNode = item.querySelector(".order-item p");

         if (itemNameNode && itemPriceNode) {
           var itemName = itemNameNode.textContent;
           var itemPrice = parseFloat(
             itemPriceNode.textContent.replace("$", "")
           );
           items.push({ name: itemName, price: itemPrice });
         }
       });

       // คำนวณราคารวม
       var totalPrice = items.reduce((acc, curr) => acc + curr.price, 0);

       // สร้างเอกสาร PDF
       var doc = new jspdf(); // หรือ var doc = new jspdf.jsPDF(); ตามที่คุณตั้งชื่อตัวแปรในการนำเข้าไลบรารี
       doc.text("Order Details", 10, 10);
       doc.text("Customer Name: " + customerName, 10, 20);
       doc.text("Customer Phone: " + customerPhone, 10, 30);
       doc.text("Order Date: " + orderDate, 10, 40);

       var startY = 50;
       items.forEach(function (item, index) {
         var text =
           index + 1 + ". " + item.name + " - $" + item.price.toFixed(2);
         doc.text(text, 10, startY + index * 10);
       });

       doc.text(
         "Total Price: $" + totalPrice.toFixed(2),
         10,
         startY + items.length * 10
       );
       doc.save("order_details.pdf");
     } else {
       alert("Please fill in all customer details!");
     }
   });

