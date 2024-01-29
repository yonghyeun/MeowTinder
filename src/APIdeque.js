import deque from './deque.js';
import InfoNode from './InfoNode.js';

export default class APIdeque extends deque {
  constructor() {
    super();
    this.fetchImg();
  }

  appendLeftNode(responseArr) {
    const bindedAppendLeft = this.appendLeft.bind(this);

    responseArr.forEach((res) => bindedAppendLeft(new InfoNode(res)));
  }

  render() {
    const wrapper = document.querySelector('.card-wrapper');

    for (let i = 0; i < 5; i += 1) {
      const newCard = this.pop().node;
      wrapper.insertBefore(newCard, wrapper.firstElementChild);
    }
  }

  fetchImg() {
    /* 서버가 벙렬 처리를 지원하지 않는다. */

    const url = 'https://api.thecatapi.com/v1/images/search';

    const appendLeftNode = this.appendLeftNode.bind(this);
    const render = this.render.bind(this);
    const urlArr = Array.from({ length: 5 }, (_, index) => url);

    Promise.all(urlArr.map((url) => fetch(url).then((res) => res.json())))
      .then((responseArr) => {
        return responseArr.map((item) => new InfoNode(item[0]));
      })
      .then(appendLeftNode)
      .then(render);
  }
}
