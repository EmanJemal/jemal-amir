import { database, ref, set, get, update, remove, onValue, child, push } from '../Script/firebase.js';

/* localStorage.setItem('Entering Pin', 45284270810258310208532513043010152410200935993930) */
const data = localStorage.getItem('Entering Pin');
if(data != 45284270810258310208532513043010152410200935993930){
 document.body.innerHTML = '<h1>You are not allowed</h1>'
}




// Fetch the room types from Firebase and update the webpage
document.addEventListener("DOMContentLoaded", function () {
    // Reference to the 'eachRoomPricing' node in Firebase
    const roomsRef = ref(database, 'eachRoomsPricing');

    // Fetch the room pricing data from Firebase
    get(roomsRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                const roomsData = snapshot.val(); // Get the data from Firebase

                // Iterate over the roomsData to update the room types in HTML
                for (const roomNumber in roomsData) {
                    if (roomsData.hasOwnProperty(roomNumber)) {
                        const room = roomsData[roomNumber];

                        // Determine floor based on room number
                        const floorSelector = roomNumber.startsWith('1') ? '#floor-1-rooms' : roomNumber.startsWith('2') ? '#floor-2-rooms' : roomNumber.startsWith('3') ? '#floor-3-rooms' : '#floor-4-rooms';

                        // Find the corresponding room in the HTML by room number
                        const roomItem = document.querySelector(`${floorSelector} li input[value="${roomNumber}"]`);

                        if (roomItem) {
                            // Update room type and pricing
                            const roomTypeElement = roomItem.closest('li').querySelector('h4');
                            const roomPriceElement = roomItem.closest('li').querySelector('.price');

                            console.log(roomPriceElement)
                            if (roomTypeElement) {
                                roomTypeElement.innerText = room.roomType;

                                    roomPriceElement.textContent = room.roomAmount;
                              

                                // Add CSS classes based on room type
                                if (room.roomType === 'Double') {
                                    roomTypeElement.className = 'double-type';
                                } else if (room.roomType === 'Deluxe') {
                                    roomTypeElement.className = 'deluxe-type';
                                } else if (room.roomType === 'Standard') {
                                    roomTypeElement.className = 'standard-type';
                                } else if (room.roomType === 'Single') {
                                    roomTypeElement.className = 'single-type';
                                }
                            }
                        }
                    }
                }
            } else {
                console.log("No data available in Firebase.");
            }
        })
        .catch(error => {
            console.error("Error fetching room data from Firebase:", error);
        });
});






// Add event listener to the submit button
const submitButton = document.querySelector('#submit-btn');
document.querySelector('.days-lable').value = 1;

submitButton.addEventListener('click', () => {
    // Fetch form values
    const name = document.querySelector('.name-lable input').value;
    const age = document.querySelector('.age-lable input').value;
    const nationality = document.querySelector('.nationality-lable input').value;
    const dob = document.querySelector('.dob-lable input').value;
    const sex = document.querySelector('#sex-options').value;
    const days = document.querySelector('.days-lable input').value;
    const finalDate = document.querySelector('.final-days-lable input').value;
    const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;
    const amountInBirr = document.querySelector('.calculation .answer').innerHTML;
    const nameOfRec = document.getElementById('passwordInput').innerHTML;

    // Identify selected room
    let selectedRoom = null;
    ['floor1', 'floor2', 'floor3', 'floor4'].forEach(floor => {
        const checkedRoom = document.querySelector(`input[name="${floor}"]:checked`);
        if (checkedRoom) selectedRoom = checkedRoom.value;
    });
    selectedRoom = selectedRoom || 'No room selected';


    const timestamp = Date.now();
    // Create a Date object
        const date = new Date(timestamp);

        // Convert to Ethiopian time (UTC+3)
        const options = {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        // Format the date to Ethiopian time
    const ethiopianTime = new Intl.DateTimeFormat('en-US', options).format(date);


        
    const userData = {
        name: name,
        age: age,
        nationality: nationality,
        dob: dob,
        sex: sex,
        days: days,
        selectedRoom: selectedRoom,
        timestamp: ethiopianTime,
        paymentMethod: selectedPayment,
        finalDate: finalDate,
        amountInBirr: amountInBirr,
        nameOfRec: nameOfRec
    }

    const paymentData = {
        name: name,
        age: age,
        nationality: nationality,
        dob: dob,
        sex: sex,
        days: days,
        selectedRoom: selectedRoom,
        timestamp: ethiopianTime,
        paymentMethod: selectedPayment,
        amountInBirr: amountInBirr,
        nameOfRec: nameOfRec
    }

    showRemovePopup(userData);


    document.getElementById('confirmRemoveBtn').addEventListener('click', ()=>{


            // Push data to Firebase Realtime Database
            const customerRef = ref(database, 'customers');
            const newCustomerRef = push(customerRef); // Creates a new unique entry
            const customerKey = name.replace(/\s+/g, '_'); 

            const userRef = ref(database, `customers/${customerKey}`);

            const timestamp = Date.now();
        // Create a Date object
            const date = new Date(timestamp);

            // Convert to Ethiopian time (UTC+3)
            const options = {
                timeZone: 'Africa/Addis_Ababa',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };

            // Format the date to Ethiopian time
            const ethiopianTime = new Intl.DateTimeFormat('en-US', options).format(date);

            let selectedRoom = null;
            ['floor1', 'floor2', 'floor3', 'floor4'].forEach(floor => {
                const checkedRoom = document.querySelector(`input[name="${floor}"]:checked`);
                if (checkedRoom) selectedRoom = checkedRoom.value;
            });
        
            if (selectedRoom && selectedRoom !== 'No room selected') {
                updateRoomStatus(selectedRoom);
            }

            
            set(userRef, userData)
            .then(() => {
                alert('Customer information submitted successfully!');
                // Optionally clear the form
                document.querySelectorAll('input').forEach(input => input.value = '');
                document.querySelector('#sex-options').value = 'None';
            })
            .catch((error) => {
                console.error('Error saving data: ', error);
                alert('Failed to submit customer information!');
            });


            // Function to generate a 7-digit random number
            function generateRandomKey() {
                return Math.floor(1000000000 + Math.random() * 90000000000); // Generates a 7-digit random number
            }

            const randomKey = generateRandomKey(); // Generate a unique 7-digit random number

            // Reference to the Payments node in the database
            const paymentRef = ref(database, 'Payments');

            // Create a reference for the new payment entry with the 7-digit random key
            const amtRef = ref(database, `Payments/${randomKey}`);

            set(amtRef, paymentData)
                .then(() => {
                    console.log('Payment data successfully saved!');
                })
                .catch((error) => {
                    console.error('Error saving data: ', error);
                    alert('Failed to submit customer payment information!');
                });


    });

});

// Real-time Listener for Room Availability
// Reference both 'rooms' and 'organisation_room'
const roomStatusRef = ref(database, 'rooms');
const orgRoomsRef = ref(database, 'organisation_room');

// Listen for updates on both references
onValue(roomStatusRef, (roomSnapshot) => {
    const roomsData = roomSnapshot.val();

    onValue(orgRoomsRef, (orgSnapshot) => {
        const organisations = orgSnapshot.val();

        // Update the radio buttons based on both sources
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            let isBooked = false;

            // Check 'rooms' reference
            if (roomsData && roomsData[radio.value] === 'booked') {
                isBooked = true;
            }

            // Check 'organisation_room' reference
            if (organisations) {
                for (const org in organisations) {
                    const bookedRooms = organisations[org]?.bookedRooms;
                    if (bookedRooms && bookedRooms.includes(radio.value)) {
                        isBooked = true;
                        break;
                    }
                }
            }

            // Apply styles based on booking status
            if (isBooked) {
                radio.disabled = true;
                radio.closest('li').classList.add('booked');
                radio.closest('li').style.color = 'grey';
            } else {
                radio.disabled = false;
                radio.closest('li').classList.remove('booked');
                radio.closest('li').style.color = 'black';
            }
        });
    });
});

// Update Room Status After Booking
function updateRoomStatus(roomNumber) {
    if (roomNumber && roomNumber !== 'No room selected') {
        const roomRef = ref(database, `rooms/${roomNumber}`);
        set(roomRef, 'booked')
        .then(() => {
            console.log(`Room ${roomNumber} marked as booked.`);
        })
        .catch((error) => {
            console.error('Error updating room status: ', error);
        });
    }
}


// Fetch elements from the DOM
const daysInput = document.querySelector('.days-lable input');
const amountInBirr = document.querySelector('.amount-in-birr');
const lengthOfStay = document.querySelector('.length-of-stay');
const answerBrr = document.querySelector('.answer-brr');

// Define the price per day (for example, 2250 Birr per day)
const pricePerDay = 220;

// Update the amount based on the number of days selected
daysInput.addEventListener('input', () => {
    const days = parseInt(daysInput.value) || 1; // Default to 1 if no input or invalid value
    const totalAmount = pricePerDay * days;
    
    // Update the calculation display
    lengthOfStay.textContent = `* ${days}`;
    answerBrr.querySelector('.answer').textContent = `${totalAmount} Birr`;
});






// rooms price

window.addEventListener('DOMContentLoaded', (event) => {
    // Function to get room pricing from Firebase
    const getRoomPricing = async () => {
        try {
            // Get the roomPricing data from the Firebase database
            const roomPricingRef = ref(database, 'roomPricing');
            const snapshot = await get(roomPricingRef);

            if (snapshot.exists()) {
                const roomPricing = snapshot.val();
                updateRoomPrices(roomPricing);
            } else {
                console.log('No room pricing data available');
            }
        } catch (error) {
            console.error('Error fetching room pricing:', error);
        }
    };

    // Function to update room prices in the DOM
    const updateRoomPrices = (roomPricing) => {
        // Select all h3 elements that represent room types
        const roomTypes = document.querySelectorAll('h4');

        roomTypes.forEach((roomTypeElement) => {
            const roomTypeClass = roomTypeElement.className.toLowerCase().split('-')[0]; // Get the room type from the class name
            const priceElement = roomTypeElement.nextElementSibling?.nextElementSibling; // Safe navigation using optional chaining

            
            // Ensure priceElement exists and update the price
            if (priceElement && roomPricing[roomTypeClass] && priceElement.innerHTML.trim() === '') {
                priceElement.textContent = roomPricing[roomTypeClass];
            } else if (priceElement) {
            }
        });
    };

    // Fetch room pricing when the page loads
    getRoomPricing();
});










/* Price calc */
document.querySelectorAll('.floor-input').forEach(input => {
    input.addEventListener('change', () => {
        const nextElement = input.nextElementSibling;
        const nextTwo = nextElement.nextElementSibling;
        const priceElement = nextTwo.nextElementSibling?.nextElementSibling;
        let finalPrice;
        let finalDay;

        console.log(nextTwo); // Log the next sibling element of the input
        
        if (nextTwo && nextTwo.textContent.trim() === 'Deluxe') {
            console.log(nextTwo.nextElementSibling);
            console.log(priceElement)
            console.log(priceElement.textContent)

            document.querySelector('.amount-in-birr').textContent = priceElement.textContent;
            finalPrice = priceElement.textContent;

            const dayInputChange = document.querySelector('.days-lable input')
            document.querySelector('.answer').innerHTML = priceElement.textContent * dayInputChange.value;
        }

        else if (nextTwo && nextTwo.textContent.trim() === 'Standard') {
            console.log(nextTwo.nextElementSibling);
            console.log(priceElement)
            console.log(priceElement.textContent)

            document.querySelector('.amount-in-birr').textContent = priceElement.textContent;
            finalPrice = priceElement.textContent;
        
            const dayInputChange = document.querySelector('.days-lable input')
            document.querySelector('.answer').innerHTML = priceElement.textContent * dayInputChange.value;
        }
        else if (nextTwo && nextTwo.textContent.trim() === 'Single') {
            console.log(nextTwo.nextElementSibling);
            console.log(priceElement)
            console.log(priceElement.textContent)

            document.querySelector('.amount-in-birr').textContent = priceElement.textContent;
            finalPrice = priceElement.textContent;

            const dayInputChange = document.querySelector('.days-lable input')
            document.querySelector('.answer').innerHTML = priceElement.textContent * dayInputChange.value;
        }
        else if (nextTwo && nextTwo.textContent.trim() === 'Double') {
            console.log(nextTwo.nextElementSibling);
            console.log(priceElement)
            console.log(priceElement.textContent)

            document.querySelector('.amount-in-birr').textContent = priceElement.textContent;
            finalPrice = priceElement.textContent;

            const dayInputChange = document.querySelector('.days-lable input')
            document.querySelector('.answer').innerHTML = priceElement.textContent * dayInputChange.value;
        }


        const days = document.querySelector('.name-of-days');
        days.addEventListener('input', () => {
            // Get the value of the input
            const daysValue = days.value;
            
            // Set the innerHTML of the '.length-of-stay' element to the value of 'days'
            document.querySelector('.length-of-stay').innerHTML = daysValue;
        
            // Assuming 'finalPrice' is already defined somewhere
            finalDay = daysValue; // Store the input value
        
            // Assuming 'finalPrice' is a number, calculate the total answer
            document.querySelector('.answer').innerHTML = daysValue * finalPrice;
        });
        
    });
});





// Function to show the popup for password input
function showRemovePopup(userData) {
    const modal = document.getElementById('removeCustomerModal');
    modal.style.display = 'block';

    document.querySelector('.information-customer .name').innerHTML = userData.name;
    document.querySelector('.information-customer .age').innerHTML = userData.age;
    document.querySelector('.information-customer .date-of-birth').innerHTML = userData.dob;
    document.querySelector('.information-customer .final-date').innerHTML = userData.finalDate;
    document.querySelector('.information-customer .payment-method').innerHTML = userData.selectedPayment;
    document.querySelector('.information-customer .room').innerHTML = userData.selectedRoom;
    document.querySelector('.information-customer .Price').innerHTML = userData.amountInBirr;

    


    // Close the popup when cancel button is clicked
    document.getElementById('cancelRemoveBtn').onclick = () => {
        modal.style.display = 'none';
    };
}