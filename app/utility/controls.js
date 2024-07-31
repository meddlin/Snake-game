const determineKeyPress = (ev) => {
    let direction = localStorage.getItem("direction");

    switch (ev.code) {
      case 'ArrowLeft':
        if (direction != 'right') {
          localStorage.setItem("direction", 'left');
        }
        break;

      case 'ArrowRight':
        if (direction != 'left') {
          localStorage.setItem("direction", 'right');
        }
        break;

      case 'ArrowUp':
        if (direction != 'down') {
          localStorage.setItem("direction", 'up');
        }
        break;

      case 'ArrowDown':
        if (direction != 'up') {
          localStorage.setItem("direction", 'down');
        }
        break;
    }
};

export default determineKeyPress;