        const resForm = document.getElementById('resForm');
        const fname = document.getElementById('fname');
        const lname = document.getElementById('lname');
        const email = document.getElementById('email');
        const roomType = document.getElementById('roomType');
        const nights = document.getElementById('nights');
        const priceDisplay = document.getElementById('priceDisplay');
        const userInfo = document.getElementById('userInfo');

        function calculateTotal() {
            const roomPrice = parseFloat(roomType.value) || 0;
            const numNights = parseInt(nights.value) || 0;
            return roomPrice * numNights;
        }

        function handleRealTimeUpdate() {
            const total = calculateTotal();
            priceDisplay.textContent = `Total: $${total}`;
        }

        roomType.addEventListener('change', handleRealTimeUpdate);
        nights.addEventListener('input', handleRealTimeUpdate);

        function getNameError(val) {
            val = val.trim();
            if (val === "") return "This field you must enter.";
            if (val.length < 3 || val.length > 15) return "Must be between 3-15 characters.";
            if (/[0-9]/.test(val)) return "Numbers are not allowed in the name.";
            return "";
        }

        resForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let errors = [];
            userInfo.innerHTML = "";

            const fnameErr = getNameError(fname.value);
            if (fnameErr) {
                fname.style.border = "2px solid red";
                errors.push(`<b>First Name:</b> ${fnameErr}`);
            } else {
                fname.style.border = "2px solid green";
            }

            const lnameErr = getNameError(lname.value);
            if (lnameErr) {
                lname.style.border = "2px solid red";
                errors.push(`<b>Last Name:</b> ${lnameErr}`);
            } else {
                lname.style.border = "2px solid green";
            }

            if (!email.value.includes('@') || email.value.trim() === "") {
                email.style.border = "2px solid red";
                errors.push(`<b>Email:</b> Please enter a valid email address.`);
            } else {
                email.style.border = "2px solid green";
            }

            if (roomType.value === "") {
                roomType.style.border = "2px solid red";
                errors.push(`<b>Room:</b> Please select a room type.`);
            } else {
                roomType.style.border = "2px solid green";
            }

            if (errors.length > 0) {
                userInfo.innerHTML = `<div style="color: #d9534f;"><b>Please correct the following errors:</b><br><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul></div>`;
            } else {
                const total = calculateTotal();
                priceDisplay.textContent = `Total: $${total}`;

                const bookingData = {
                    firstName: fname.value.trim(),
                    lastName: lname.value.trim(),
                    email: email.value,
                    room: roomType.options[roomType.selectedIndex].text,
                    nights: nights.value,
                    totalPrice: `Total: $${total}`
                };

                let customerReservations = JSON.parse(localStorage.getItem("hotelBookings")) || [];
                customerReservations.push(bookingData);
                localStorage.setItem('hotelBookings', JSON.stringify(customerReservations));
                localStorage.setItem('lastBooking', JSON.stringify(bookingData));

                userInfo.innerHTML = `<div style="color: green; text-align: center; font-weight: bold;"> Success your reservation welcom.</div>`;
            }
        });

        window.onload = function() {
            handleRealTimeUpdate();

            const savedData = localStorage.getItem('lastBooking');
            if (savedData) {
                const data = JSON.parse(savedData);
                userInfo.innerHTML = `<div style="color: #bc986a; text-align: center;">Welcome back <b>${data.firstName}</b>! Your last reservation was <b>${data.totalPrice}</b>.</div>`;
            }
        }