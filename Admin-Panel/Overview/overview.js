import { database, ref, set, get, update, remove, onValue, child, push } from '../../Script/firebase.js';


// References to DOM Elements
const roomsReservedElement = document.querySelector('.total-rooms-reserved h1');
const dailyRevenueElement = document.querySelector('.total-money-made-day h1');

// Reference to the rooms and customers nodes in the database
const roomsRef = ref(database, 'rooms');
const customersRef = ref(database, 'customers');
const orgRef = ref(database, 'organisation_room');

// DOM Reference
const monthlyRevenueElement = document.querySelector('.total-money-made-month h1');

// Reference to the Payments node
const paymentsRef = ref(database, 'Payments');

/* Calculate Total Occupied Rooms */
onValue(roomsRef, (snapshot) => {
    if (snapshot.exists()) {
        const roomsData = snapshot.val();
        let bookedRoomsCount = 0;

        for (const room in roomsData) {
            if (roomsData[room] === 'booked') {
                bookedRoomsCount++;
            }
        }

        roomsReservedElement.textContent = bookedRoomsCount;
    } else {
        console.log("No room data available");
        roomsReservedElement.textContent = 0;
    }
}, (error) => {
    console.error("Error fetching room data:", error);
});

/* Calculate Total Money Made Today */
onValue(customersRef, (snapshot) => {
    if (snapshot.exists()) {
        const customersData = snapshot.val();
        let totalRevenue = 0;

        for (const customer in customersData) {
            const amount = customersData[customer].amountInBirr;
            if (amount) {
                totalRevenue += Number(amount); // Ensure it's added as a number
            }
        }

        dailyRevenueElement.textContent = `${totalRevenue.toLocaleString()} Birr`;
    } else {
        console.log("No customer data available");
        dailyRevenueElement.textContent = '0 Birr';
    }
}, (error) => {
    console.error("Error fetching customer data:", error);
});





/* Calculate Monthly Revenue */
onValue(paymentsRef, (snapshot) => {
    if (snapshot.exists()) {
        const paymentsData = snapshot.val();
        let monthlyRevenue = 0;

        // Get current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        for (const paymentId in paymentsData) {
            const payment = paymentsData[paymentId];
            const { amountInBirr, timestamp } = payment;

            if (amountInBirr && timestamp) {
                const paymentDate = parseCustomTimestamp(timestamp);

                if (!isNaN(paymentDate)) {
                    const paymentYear = paymentDate.getFullYear();
                    const paymentMonth = paymentDate.getMonth() + 1;

                    // Check if the payment was made in the current month and year
                    if (paymentYear === currentYear && paymentMonth === currentMonth) {
                        monthlyRevenue += Number(amountInBirr);
                    }
                } else {
                    console.warn(`Invalid date format for payment ID: ${paymentId}`);
                }
            }
        }

        // Update the monthly revenue on the admin panel
        monthlyRevenueElement.textContent = `${monthlyRevenue.toLocaleString()} Birr`;
    } else {
        console.warn("No payment data found for this month.");
        monthlyRevenueElement.textContent = '0 Birr';
    }
}, (error) => {
    console.error("Error fetching payment data: ", error);
    monthlyRevenueElement.textContent = 'Error';
});


/* Custom Timestamp Parser */
function parseCustomTimestamp(timestamp) {
    const regex = /([a-zA-Z]+) (\d{1,2}), (\d{4}) at (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/;
    const match = timestamp.match(regex);

    if (match) {
        const monthStr = match[1];
        const day = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        let hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);
        const second = parseInt(match[6], 10);
        const period = match[7];  // AM or PM

        // Convert 12-hour format to 24-hour format
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        // Create a JavaScript Date object
        const month = new Date(Date.parse(`${monthStr} 1, 2024`)).getMonth();  // Convert month name to number
        return new Date(year, month, day, hour, minute, second);
    } else {
        console.error('Invalid timestamp format:', timestamp);
    }
}








// Function to update the UI based on room booking status
function updateRoomStatus(roomNumber, status) {
    // Create a new list item for each room
    const roomElement = document.createElement('li');
    roomElement.textContent = roomNumber;
    roomElement.dataset.room = roomNumber; // Set room number as a data attribute

    // Add appropriate class based on room status
    if (status === 'booked') {
        roomElement.classList.add('booked');
    } else {
        roomElement.classList.add('available');
    }

    // Append the room to the correct floor based on the room number
    if (roomNumber.startsWith('10')) {
        document.querySelector('#floor-one').appendChild(roomElement);
    } else if (roomNumber.startsWith('20')) {
        document.querySelector('#floor-two').appendChild(roomElement);
    } else if (roomNumber.startsWith('30')) {
        document.querySelector('#floor-three').appendChild(roomElement);
    } else if (roomNumber.startsWith('40')) {
        document.querySelector('#floor-four').appendChild(roomElement);
    }
}

// Fetch room statuses from Firebase
onValue(roomsRef, (snapshot) => {
    const roomsData = snapshot.val();

    // Clear the previous room data to avoid duplication
    document.querySelector('#floor-one').innerHTML = '';
    document.querySelector('#floor-two').innerHTML = '';
    document.querySelector('#floor-three').innerHTML = '';
    document.querySelector('#floor-four').innerHTML = '';

    // Iterate over rooms data and display rooms dynamically
    Object.keys(roomsData).forEach((roomNumber) => {
        const status = roomsData[roomNumber];
        updateRoomStatus(roomNumber, status);
    });
});





// Function to update the UI based on room booking status
function updateRoomStatusORG(roomNumber, status) {
    // Create a new list item for each room
    const roomElement = document.createElement('li');
    roomElement.textContent = roomNumber;
    roomElement.dataset.room = roomNumber; // Set room number as a data attribute

    console.log(roomElement)

    // Add appropriate class based on room status
    if (status === 'booked') {
        roomElement.classList.add('booked');
    } else {
        roomElement.classList.add('available');
    }

    // Append the room to the correct floor based on the room number
    if (roomNumber.startsWith('10')) {
        document.querySelector('.org-daily-table #floor-one').appendChild(roomElement);
    } else if (roomNumber.startsWith('20')) {
        document.querySelector('.org-daily-table #floor-two').appendChild(roomElement);
    } else if (roomNumber.startsWith('30')) {
        document.querySelector('.org-daily-table #floor-three').appendChild(roomElement);
    } else if (roomNumber.startsWith('40')) {
        document.querySelector('.org-daily-table #floor-four').appendChild(roomElement);
    }
}

// Fetch room statuses from Firebase
onValue(orgRef, (snapshot) => {
    const orgData = snapshot.val();

    console.log(orgData)
    // Clear the previous room data to avoid duplication
    document.querySelector('.org-daily-table #floor-one').innerHTML = '';
    document.querySelector('.org-daily-table #floor-two').innerHTML = '';
    document.querySelector('.org-daily-table #floor-three').innerHTML = '';
    document.querySelector('.org-daily-table #floor-four').innerHTML = '';

    // Iterate over rooms data and display rooms dynamically
    Object.keys(orgData).forEach((roomNumber) => {
        const status = orgData[roomNumber];
        console.log(status)
        updateRoomStatusORG(roomNumber, status);
    });
});





// Function to get the last 6 days with the format "Month short form day"
function getLastSixDays() {
    const daysContainer = document.querySelector('.days'); // The container where the days will be displayed
    const today = new Date();
    
    // Loop through the last 6 days
    for (let i = 0; i < 6; i++) {
        const date = new Date(today); // Create a new date object to avoid mutation
        date.setDate(today.getDate() - i); // Subtract days from today
        
        // Get the month (short form like Jan, Feb, Mar, etc.)
        const month = date.toLocaleString('en-US', { month: 'short' });
        
        // Get the day of the month (e.g., 26)
        const day = date.getDate();
        
        // Create a div for each day
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        
        // Add the month and day as h2 elements
        dayDiv.innerHTML = `<h2 class="month-last-six-day">${month}</h2> <h2>${day}</h2>`;
        
        // Append the new day div to the container
        daysContainer.appendChild(dayDiv);
    }
}

// Call the function to display the last 6 days
getLastSixDays();


// Select all the elements with the class 'day'
const days = document.querySelectorAll('.day');

// Function to format the date as "Month short form day"
function formatDate(month, day) {
    const date = new Date();
    date.setMonth(month - 1); // Months are 0-indexed
    date.setDate(day);
    return date.toLocaleString('en-US', { month: 'short', day: '2-digit' }); // Example: "Dec 28"
}

// Loop through each 'day' and add a click event listener
days.forEach(day => {
    day.addEventListener('click', async (event) => {
        document.querySelector('.rooms').innerHTML = '';

        // Get the clicked day (the second <h2> element inside the clicked day div)
        const dayNumber = event.target.closest('.day').querySelector('h2:nth-of-type(2)').textContent;
        const month = event.target.closest('.day').querySelector('h2:nth-of-type(1)').textContent;

        // Display the month and day number (you can use this data as needed)
        console.log(`You clicked: ${month} ${dayNumber}`);

        // Format the selected date
        const selectedDateFormatted = `${month} ${dayNumber}`;

        // Fetch the Payments data from Firebase
        const paymentsRef = ref(database, 'Payments');
        const snapshot = await get(paymentsRef);

        if (snapshot.exists()) {
            // Loop through all payment entries and check if the timestamp matches the selected date
            const payments = snapshot.val();
            const matchingPayments = [];

            for (const paymentId in payments) {
                const payment = payments[paymentId];
                const paymentTimestamp = payment.timestamp // Convert timestamp to Date object
                const formattedPaymentDate = paymentTimestamp.toLocaleString('en-US', { month: 'short', day: '2-digit' });
                
                

                // Remove the time part to avoid the invalid date error
                const cleanedDateStr = formattedPaymentDate.split(' at ')[0];

                // Create a Date object from the cleaned string
                const date = new Date(cleanedDateStr);

                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });



                if (formattedDate === selectedDateFormatted) {
                    matchingPayments.push(payment); // Store matching payments
                }

            }

            if (matchingPayments.length > 0) {

                    matchingPayments.forEach((payment)=>{
                        console.log(payment);
                        
                        const HTML = `
                                <div class="room">
                                    <h1 class="room-no">Room ${payment.selectedRoom}</h1>
                                    <h3>${payment.name}</h3>
                                    <h3 class="date">${payment.timestamp}</h3>
                                    <p><strong> Sex:</strong><strong class="color-blue"> ${payment.sex}</strong></p>
                                    <p><strong> Original Length of stay:</strong> <strong class="color-blue">${payment.days} Days</strong></p>
                                    <p><strong> How many days left:</strong> <strong class="color-blue">3 Days</strong></p>
                                    <p><strong> Amount:</strong> <strong class="color-blue">${payment.amountInBirr} Birr</strong></p>
                                    <p><strong> Registration by:</strong> <strong class="color-blue">Arafat</strong></p>
                                </div>`;
                        document.querySelector('.rooms').innerHTML += HTML

                    });
                    
            } else {
                console.log('No payments found for this day');
            }
        } else {
            console.log('No payments data available');
        }

        // Add a selected class to highlight the clicked day
        days.forEach(d => d.classList.remove('selected')); // Remove previous selections
        event.target.closest('.day').classList.add('selected'); // Add selected class to the clicked day
    });
});


const selectedDate = document.querySelector('.free-hand-date')


selectedDate.addEventListener('change', async (event) => {
    document.querySelector('.rooms').innerHTML = '';

    // Get the clicked day (the second <h2> element inside the clicked day div)
    const selectedDateValue = selectedDate.value;

    // Create a Date object from the string
    const date = new Date(selectedDateValue);


    // Subtract days dynamically (e.g., go back 3 days to reach Dec 31)
    date.setDate(date.getDate());

    // Format as "Dec 31"
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


    console.log(formattedDate); 


    // Format the selected date
    const selectedDateFormatted = formattedDate;

    // Fetch the Payments data from Firebase
    const paymentsRef = ref(database, 'Payments');
    const snapshot = await get(paymentsRef);

    if (snapshot.exists()) {
        // Loop through all payment entries and check if the timestamp matches the selected date
        const payments = snapshot.val();
        const matchingPayments = [];

        for (const paymentId in payments) {
            const payment = payments[paymentId];
            const paymentTimestamp = payment.timestamp // Convert timestamp to Date object
            const formattedPaymentDate = paymentTimestamp.toLocaleString('en-US', { month: 'short', day: '2-digit' });
            
            

            // Remove the time part to avoid the invalid date error
            const cleanedDateStr = formattedPaymentDate.split(' at ')[0];

            // Create a Date object from the cleaned string
            const date = new Date(cleanedDateStr);

            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });



            if (formattedDate === selectedDateFormatted) {
                matchingPayments.push(payment); // Store matching payments
            }

        }

        if (matchingPayments.length > 0) {

                matchingPayments.forEach((payment)=>{
                    console.log(payment);
                    
                    const HTML = `
                            <div class="room">
                                <h1 class="room-no">Room ${payment.selectedRoom}</h1>
                                <h3>${payment.name}</h3>
                                <h3 class="date">${payment.timestamp}</h3>
                                <p><strong> Sex:</strong><strong class="color-blue"> ${payment.sex}</strong></p>
                                <p><strong> Original Length of stay:</strong> <strong class="color-blue">${payment.days} Days</strong></p>
                                <p><strong> How many days left:</strong> <strong class="color-blue">3 Days</strong></p>
                                <p><strong> Registration by:</strong> <strong class="color-blue">Arafat</strong></p>
                            </div>`;
                    document.querySelector('.rooms').innerHTML += HTML

                });
                
        } else {
            console.log('No payments found for this day');
        }
    } else {
        console.log('No payments data available');
    }

});