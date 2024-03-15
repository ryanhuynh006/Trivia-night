document.addEventListener('DOMContentLoaded', function() {
    var countdownBar = document.getElementById('countdown-bar');
    var duration = 60; // 60 seconds
    var width = 0; // Initial width of the bar
    var interval = setInterval(function() {
      width += 100 / duration;
      countdownBar.style.width = width + '%';
      if (width >= 100) {
        clearInterval(interval);
        // Countdown finished, you can add any additional actions here
        alert('Countdown finished!');
      }
    }, 1000); // Update every second
  });
