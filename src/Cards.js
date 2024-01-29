import APIdeque from './APIdeque.js';

export default class Cards {
  constructor() {
    this.wrapper = document.querySelector('.card-wrapper');
    this.cardWidth = document.querySelector('.card').clientWidth;
    this.setup();
    this.mounted();
  }

  calculateOffset = (event) => {
    const { initialCoord } = this;
    this.offset = {
      X: event.clientX - initialCoord.X,
      Y: event.clientY - initialCoord.Y,
    };
    return this.offset;
  };

  makeEffect = (offsetX, alpha = 5) => {
    const { cardWidth } = this;
    const shadow = offsetX > 0 ? '#a81d3e' : '#aaa';
    const rot = (offsetX / cardWidth) * alpha;

    return { shadow, rot };
  };

  changeCard = (offset, effects) => {
    const { current } = this;
    current.style.transform = `translate3D(${offset.X}px ,${offset.Y}px , 10px)
    rotate(${effects.rot}deg)`;
    current.style.boxShadow = `0px 0px 50px 50px ${effects.shadow};`;
  };

  moveCard = (event) => {
    const offset = this.calculateOffset(event);
    const effects = this.makeEffect(offset.X);
    this.changeCard(offset, effects);
  };

  chooseCard = (delay = 1000) => {
    const { current, offset } = this;
    current.style.transition = `all ${delay}ms`;
    current.style.transform = `translate3D(${offset.X * 5}px , ${
      offset.Y * 5
    }px , 0px)`;

    this.count -= 1;

    /* 카드가 선택되면 카드를 더 가져와야 하는지 확인 */
    if (this.count < 5) {
      this.deque.fetchImg();
      this.count += 5;
    }

    setTimeout(() => {
      this.wrapper.removeChild(current);
      this.setup();
    }, delay * 0.7);
  };

  initializeCard = (delay = 1000) => {
    const { current } = this;
    current.style.transition = `all ${delay}ms`;
    current.style.transform = 'translate3D(0px,0px,0px)';

    setTimeout(() => {
      current.style.transition = '';
      this.setup();
    }, delay);
  };

  clearAllEvent = () => {
    const { setupCard, moveCard, terminateEvent } = this;

    this.current.removeEventListener('pointerdown', setupCard);
    this.current.removeEventListener('pointermove', moveCard);
    this.current.removeEventListener('pointerup', terminateEvent);
    this.current.removeEventListener('pointerleave', terminateEvent);
  };

  terminateEvent = () => {
    const { offset, cardWidth, clearAllEvent } = this;

    if (Math.abs(offset.X) > cardWidth) this.chooseCard();
    else this.initializeCard();
    clearAllEvent();
  };

  setAllEvent = () => {
    const { moveCard, terminateEvent } = this;
    this.current.addEventListener('pointermove', moveCard);
    this.current.addEventListener('pointerup', terminateEvent);
    this.current.addEventListener('pointerleave', terminateEvent);
  };

  setupCard = (event) => {
    this.initialCoord = { X: event.clientX, Y: event.clientY };
    this.setAllEvent();
  };

  setup() {
    this.current = this.wrapper.lastElementChild;
    this.initialCoord = { X: 0, Y: 0 };
    this.offset = { X: 0, Y: 0 };
    const { setupCard } = this;

    this.current.addEventListener('pointerdown', setupCard);
  }

  mounted() {
    this.deque = new APIdeque();
    this.count = 6; /* fetch 로 가져온 이미지 개수 */
  }
}
