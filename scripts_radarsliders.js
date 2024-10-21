document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const data = {
        labels: ['Fitness', 'Skills', 'Agility', 'Speed', 'Maturity', 'Intelligence', 'Coachable', 'D Position', 'Tackling'],
        datasets: [{
            label: 'Player Evaluation',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: true,
            backgroundColor: '#333333',
            borderColor: '#C8A563',
            pointBackgroundColor: '#C8A563',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#C8A563'
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: { borderWidth: 3 }
            },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: { display: false }  // Remove axis ticks
                }
            }
        }
    };

    const radarChart = new Chart(ctx, config);

    // Function to update chart based on slider input values
    function updateChart() {
        const scores = [
            parseInt(document.getElementById('fitness').value),
            parseInt(document.getElementById('skills').value),
            parseInt(document.getElementById('agility').value),
            parseInt(document.getElementById('speed').value),
            parseInt(document.getElementById('maturity').value),
            parseInt(document.getElementById('intelligence').value),
            parseInt(document.getElementById('coachable').value),
            parseInt(document.getElementById('dPosition').value),
            parseInt(document.getElementById('tackling').value)
        ];

        radarChart.data.datasets[0].data = scores;
        radarChart.update();
    }

    // Attach event listeners to each slider
    document.querySelectorAll('.score-slider').forEach(slider => {
        slider.addEventListener('input', () => {
            updateChart();  // Update the chart when a slider changes
            document.getElementById(slider.id + 'Value').textContent = slider.value;  // Update displayed slider value
        });
    });

    // Save player data to localStorage
    function savePlayerData() {
        const playerName = document.getElementById('playerName').value;
        if (!playerName) {
            alert('Please enter a player name');
            return;
        }

        const scores = radarChart.data.datasets[0].data;
        const players = JSON.parse(localStorage.getItem('players')) || {};
        players[playerName] = scores;

        localStorage.setItem('players', JSON.stringify(players));
        loadPlayerList();
        showFeedbackMessage('Player data saved successfully.');
    }

    // Load saved player data from localStorage
    function loadPlayerData() {
        const playerName = document.getElementById('playerList').value;
        if (!playerName) {
            alert('Please select a player');
            return;
        }

        const players = JSON.parse(localStorage.getItem('players')) || {};
        if (players[playerName]) {
            radarChart.data.datasets[0].data = players[playerName];
            radarChart.update();
            setSliderValues(players[playerName]);
            showFeedbackMessage('Player data loaded successfully.');
        }
    }

    // Set slider values based on player data
    function setSliderValues(scores) {
        document.getElementById('fitness').value = scores[0];
        document.getElementById('fitnessValue').textContent = scores[0];
        document.getElementById('skills').value = scores[1];
        document.getElementById('skillsValue').textContent = scores[1];
        document.getElementById('agility').value = scores[2];
        document.getElementById('agilityValue').textContent = scores[2];
        document.getElementById('speed').value = scores[3];
        document.getElementById('speedValue').textContent = scores[3];
        document.getElementById('maturity').value = scores[4];
        document.getElementById('maturityValue').textContent = scores[4];
        document.getElementById('intelligence').value = scores[5];
        document.getElementById('intelligenceValue').textContent = scores[5];
        document.getElementById('coachable').value = scores[6];
        document.getElementById('coachableValue').textContent = scores[6];
        document.getElementById('dPosition').value = scores[7];
        document.getElementById('dPositionValue').textContent = scores[7];
        document.getElementById('tackling').value = scores[8];
        document.getElementById('tacklingValue').textContent = scores[8];
    }

    // Load the list of players from localStorage
    function loadPlayerList() {
        const players = JSON.parse(localStorage.getItem('players')) || {};
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '<option value="">Select a Player</option>';

        Object.keys(players).forEach(playerName => {
            const option = document.createElement('option');
            option.value = playerName;
            option.textContent = playerName;
            playerList.appendChild(option);
        });
    }

    // Display feedback message
    function showFeedbackMessage(message) {
        const feedbackMessage = document.getElementById('feedbackMessage');
        feedbackMessage.textContent = message;
        setTimeout(() => {
            feedbackMessage.textContent = '';
        }, 3000);
    }

    // Attach event listeners for saving and loading players
    document.getElementById('savePlayer').addEventListener('click', savePlayerData);
    document.getElementById('playerList').addEventListener('change', loadPlayerData);

    // Load player list on page load
    loadPlayerList();

    // Generate and download PDF of radar chart, sliders, and comments
function downloadChart() {
    // Capture the value entered in the player name input field
    const playerName = document.getElementById('playerName').value.trim();  // Get the value of the input field
    const rightSection = document.querySelector('.right-section');
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF('p', 'pt', 'a4');

    // Remove unwanted elements from view before capture
    const playerNameInput = document.getElementById('playerName');
    const commentsTextArea = document.getElementById('comments');
    const downloadButton = document.getElementById('downloadChart');
    const playerListDropdown = document.getElementById('playerList');  // The saved player name dropdown

    // Temporarily hide elements not needed in the PDF
    playerNameInput.style.display = 'none';
    commentsTextArea.style.display = 'none';
    downloadButton.style.display = 'none';
    playerListDropdown.style.display = 'none';  // Hide the saved player dropdown

    // Capture the right section as a canvas
    html2canvas(rightSection).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Show hidden elements after capture
        playerNameInput.style.display = '';
        commentsTextArea.style.display = '';
        downloadButton.style.display = '';
        playerListDropdown.style.display = '';  // Show the saved player dropdown again

        // Use the player's name from the input field, or fallback to a default text
        const playerTitle = playerName || 'Unnamed Player';

        // Add the player's name as the title, centered at the top of the PDF
        pdf.setFont('Times', 'bold');
        pdf.setFontSize(24);
        pdf.text(playerTitle, pdf.internal.pageSize.width / 2, 40, { align: 'center' });

        // Add the radar chart and sliders image to the PDF
        pdf.addImage(imgData, 'PNG', 40, 80, 500, 500);

        // Add the slider values stacked below the chart
        const sliderLabels = [
            'Fitness', 'Skills', 'Agility', 'Speed',
            'Maturity', 'Intelligence', 'Coachable', 'D Position', 'Tackling'
        ];
        const sliderValues = [
            document.getElementById('fitness').value,
            document.getElementById('skills').value,
            document.getElementById('agility').value,
            document.getElementById('speed').value,
            document.getElementById('maturity').value,
            document.getElementById('intelligence').value,
            document.getElementById('coachable').value,
            document.getElementById('dPosition').value,
            document.getElementById('tackling').value
        ];

        pdf.setFont('Times', 'normal');
        pdf.setFontSize(12);
        
        let sliderYPosition = 600;  // Start position for the slider values
        for (let i = 0; i < sliderLabels.length; i++) {
            pdf.text(`${sliderLabels[i]}: ${sliderValues[i]}`, 40, sliderYPosition);  // Add each label and value
            sliderYPosition += 15;  // Move the position down for the next slider
        }

        // Add the comments below the slider values
        const comments = commentsTextArea.value;
        const commentsX = 40;
        sliderYPosition += 20;  // Add some space before the comments

        wrapTextPDF(pdf, comments, commentsX, sliderYPosition, 500, 15);

        // Save the PDF with the player's name as part of the file name
        pdf.save(`${playerTitle}-evaluation.pdf`);
    });
}





    // Helper function to wrap text in PDF
    function wrapTextPDF(doc, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        words.forEach((word, index) => {
            const testLine = line + word + ' ';
            const testWidth = doc.getTextWidth(testLine);

            if (testWidth > maxWidth && index > 0) {
                doc.text(x, y, line);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        });

        doc.text(x, y, line);  // Draw the final line
    }

    // Attach event listener for PDF download
    document.getElementById('downloadChart').addEventListener('click', downloadChart);
});


