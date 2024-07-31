const determineKeyPress = (ev) => {
    console.log(`pressed: ${ev.code}`);
    // console.log(`pressed - type: ${typeof(ev.code)}`)
    let direction = localStorage.getItem("direction");
    console.log(`LS - direction: ${direction}`)

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