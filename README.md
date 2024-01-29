<img src = 'https://velog.velcdn.com/images/yonghyeun/post/2b3fb81a-e5c0-497d-bf51-a9c46afe4374/image.gif' alt = 'result'>

> <a href = 'https://www.youtube.com/watch?v=O0rgN2H9pEY'>자바스크립트로 소개팅앱 스타일 카드 스와이프 마스터하기</a>
> 해당 영상을 한 번 슥~ 본 후에 내 스타일대로 다시 만들어보는 토이프로젝트

> <a href = 'https://yonghyeun.github.io/MeowTinder/'>완성본 페이지</a> > <a href= 'https://github.com/yonghyeun/MeowTinder'>코드 전문</a>
> 버튼을 누르거나 좌우로 넘겨도 아무런 일이 일어나지 않습니다
> 하지만 귀여운 고양이 사진이 무한으로 나와요

---

# 🐤 `HTML , CSS` 구조 잡기

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cat-tinder</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <div class="card-wrapper">
        <div class="card"></div>
        <div class="card"></div>
        <div class="card"></div>
        <div class="card"></div>
        <div class="card">
          <div class="info-wrapper">
            <p class="person-name">Jerry</p>
            <p class="person-greet">Hello</p>
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <button class="dislike">🙀</button>
      <button class="like">😻</button>
    </div>
  </body>
  <script src="main.js"></script>
</html>
```

![](https://velog.velcdn.com/images/yonghyeun/post/8d4ec78f-7446-4a4f-8c82-00d9d718f3cb/image.png)

대충 이런식의 구조를 잡아놓고 자바스크립트에 들어갔다.

고양이의 사진들은 들어갈 때 마다 랜덤한 고양이의 사진들을 제공해주는 `API` 를 사용했다.

> `API` 출처 : https://api.thecatapi.com/v1/images/search
>
> ```
> [{"id":"aci",
> "url":"https://cdn2.thecatapi.com/images/aci.jpg",
> "width":560,"height":413
> }]
> ```
>
> 이런식으로 생긴 `JSON` 파일을 준다.

고양이의 사진들을 `card` 의 `background : url()` 을 이용해 채워주고

`background-size : cover , background-position : center` 로 중앙 정렬 및 사이즈를 맞춰주었다.

`card` 들은 모두 `absoulte` 형태로 쌓여있기 때문에 스와이프를 통해 가장 마지막 카드가 스와이프되어 제거되면

그 다음 밑에 있는 카드가 나타나는 형태이다.

---

# 🐧 이벤트 핸들러 기능 구현

```js
  setup() {
    this.current = this.wrapper.lastElementChild;
    this.initialCoord = { initX: 0, initY: 0 };
    this.moveCoord = { moveX: 0, moveY: 0 };
    this.offset = { X: 0, Y: 0 };

    if (!this.cardWidth) this.cardWidth = this.current.clientWidth;

    const cardSetup = (event) => {
      const { current } = this;
      this.initialCoord = { initX: event.clientX, initY: event.clientY };

      const cardMove = (event) => {
        this.moveCoord = { moveX: event.clientX, moveY: event.clientY };
        const { cardWidth } = this;
        const { moveX, moveY } = this.moveCoord;
        const { initX, initY } = this.initialCoord;
        this.offset = { offsetX: moveX - initX, offsetY: moveY - initY };
        const { offsetX, offsetY } = this.offset;

        const likeShadow = offsetX > 0 ? '#a81d3e' : '#aaa';
        const alpha = 5;
        const likeRot = (offsetX / cardWidth) * alpha;

        current.style.transform = `translate3D(${offsetX}px ,${offsetY}px , 10px)
        rotate(${likeRot}deg)`;
        current.style.boxShadow = `0px 0px 50px 50px ${likeShadow};`;
      };

      const cardLeave = () => {
        const { cardWidth } = this;
        const { offsetX, offsetY } = this.offset;
        const delay = 1000;

        if (Math.abs(offsetX) < cardWidth) {
          current.style.transition = `all ${delay}ms`;
          setTimeout(() => {
            current.style.transition = 'all 0s';
          }, delay * 0.9);

          current.style.transform = 'translate3D(0px,0px,0px)';
        } else {
          current.style.transition = `all ${delay}ms`;
     	  setTimeout(() => {
            current.style.transition = 'all 0s';
            this.wrapper.removeChild(current);
            this.setup();
          }, delay * 0.5);
          current.style.transform = `translate3D(${offsetX * 5}px,${
            offsetY * 5
          }px,0px)`;
        }

        current.removeEventListener('pointerup', cardLeave);
        current.removeEventListener('pointermove', cardMove);
        current.removeEventListener('pointerleave', cardLeave);
      };

      current.addEventListener('pointermove', cardMove);
      current.addEventListener('pointerleave', cardLeave);
      current.addEventListener('pointerup', cardLeave);
    };

    this.current.addEventListener('pointerdown', cardSetup);
  }
```

![](https://velog.velcdn.com/images/yonghyeun/post/6c0142de-af3f-43c1-bafa-b4dae837a896/image.gif)

예시 카드 한장만 가지고 이벤트를 등록해주었다.

가장 마지막 카드를 선택한 순간 `ponitermove , pointerup , pointerleave` 에 대해

카드가 이동하고 포인터 클릭이 해제 되거나 포인터가 카드를 벗어나는 순간

제자리로 돌아오거나 아예 벗어나고 삭제되도록 하였다.

삭제된 후에는 `setup()` 메소드를 다시 호출하도록 하여 다음 카드 등록 , 기초 좌표 등록 등의 행위를 해주었다.

# 🐣 이벤트 핸들러 리팩토링

코드가 너무 지저분하니 리팩토링을 해주자

문제점을 찾아보자

- 현재 `cardMove , cardLeave` 콜백함수는 `cardSetup` 함수가 호출 될 때마다 새로 등록되기 때문에 비효율적이다. `cardSetup` 함수 밖에서 선언해두고 불러오기만 하도록 하자

- 대부분의 작업들이 캡슐화되어있는 것이 아니기에 코드들이 어떤 행위를 하는 것인지 이해하기 쉽지 않다. 행위들을 캡슐화 해줘 단일 책임 원칙을 따르도록 하자

- 변수들을 지속적으로 `const` 와 함께 선언하여 불러오니 가독성이 떨어진다. 많은 값들을 담을 수 있는 자료구조를 만들어주자

### 불필요한 자료구조 삭제

`moveCoord` 자료구조는 `offset` 을 설정하기 위해서만 필요한 자료구조였기 때문에 삭제해주고

`offset` 자료구조의 형태를 변경해주어서 불필요한 변수 선언문을 삭제해주었다.

```js
	/* 리팩토링 전 선언 단계 */
/* initialCoord 객체에 initX , initY 라는 비효율적 프로퍼티명이 존재함 */
	this.initialCoord = { initX: event.clientX, initY: event.clientY };

	  const cardMove = (event) => {
/* moveCoord 는 offset 자료구조를 생성하기 위해 필요했던 임시 버퍼 */
        this.moveCoord = { moveX: event.clientX, moveY: event.clientY };
        const { cardWidth } = this;
        const { moveX, moveY } = this.moveCoord;
        const { initX, initY } = this.initialCoord;
/* 값 재할당과 선언이 불필요하게 두 번씩 일어났음  */
        this.offset = { offsetX: moveX - initX, offsetY: moveY - initY };
/*offset 객체에 offsetX , offsetY 라는 비효율적 프로퍼티 명이 존재함 */
        const { offsetX, offsetY } = this.offset;
      ...
    }
```

```js
	  /* 리팩토링 이후 선언 단계 */
	  /* initialCoord 프로퍼티명 변경  */
      this.initialCoord = { X: event.clientX, Y: event.clientY };

      const cardMove = (event) => {
        const { initialCoord, offset, cardWidth } = this;
        this.offset = {
          /* offset.X , offset.Y 로 참조 할 수 있도록 함
          moveCoord 자료구조 없이 바로 값을 변경 할 수 있도록 함 */
          X: event.clientX - initialCoord.X,
          Y: event.clientY - initialCoord.Y,
        };
		...
```

### 단일 책임 원칙 위해 함수 캡슐화

지저분하게 나열되어있던 코드블록들을 행위 별로 캡슐화해주었다.

```js
class Cards {

  ...
  /*constructor 와 여러 메소드들 .. */
  ...
    setupCard(event) {
    this.initialCoord = { X: event.clientX, Y: event.clientY };
    const { moveCard, terminateEvent } = this;
    this.current.addEventListener('pointermove', moveCard);
    this.current.addEventListener('pointerup', terminateEvent);
    this.current.addEventListener('pointerleave', terminateEvent);
  }

  setup() {
    /* 렌더링 즉시 마지막 카드에 이벤트 핸들러들을 등록하는 메소드*/
    this.current = this.wrapper.lastElementChild;
    this.initialCoord = { X: 0, Y: 0 };
    this.offset = { X: 0, Y: 0 };

    const { setupCard } = this;

    this.current.addEventListener('pointerdown', setupCard);
  }
}
```

모두 8개의 **메소드**로 구분을 한 후 `setup` 메소드 단계에서는 현재 카드에 `setupCard` 라는 이벤트 핸들러를 등록해주었다.

`setupCard` 메소드가 호출되면 **메소드**로 등록된 함수들이 딱딱 이벤트 핸들러로 등록될줄 알았는데 문제가 발생했다.

### 👀 `this` 바인딩 문제 발견

![](https://velog.velcdn.com/images/yonghyeun/post/41b23557-b7b7-49b2-8c0e-d9a4ba10f324/image.png)

![](https://velog.velcdn.com/images/yonghyeun/post/988d7a27-a333-4fc1-a444-7aa67ac63d17/image.png)

`setupCard` 메소드가 호출 될 때 `this.current` 를 찾지 못한다는 것이다.
`current` 뿐이 아니라 클래스 내부에서 선언된 프로퍼티와 메소드들을 모두 찾지 못한다.

그래서 `setupCard` 가 호출 될 때 바인딩 된 `this` 가 무엇을 가리키나 로그를 해보았다.

![](https://velog.velcdn.com/images/yonghyeun/post/7778332d-c376-4dee-9389-18a0beedd600/image.png)
![](https://velog.velcdn.com/images/yonghyeun/post/df3f0eb2-accc-4613-8728-ce8dbd4205a9/image.gif)

> 아 진짜 왜이래~!~!~!~!

왜 `this` 가 `class Cards` 를 가리키는게 아니라 `div` 태그를 가리킬까 ?

클래스 내부에서 선언된 메소드들의 `this` 는 항상 클래스의 인스턴스를 가리키는거 아닌가 ? 하고 30분동안 삽질했다.

그래서 머리 식히러 산책 하고 오면서 깨달았다.

**`this` 는 항상 자신을 호출한 객체를 가리킨다는 점을 .. **

`class Cards` 내부에 있는 메소드를 `<div class = 'card'></div>` 의 이벤트 핸들러로 등록한 순간부터

메소드를 호출하는 주체는 `<div class = 'card'></div>` 이기 때문에 호출되는 `setupCard` 메소드의 `this` 는 `class Cards` 가 아닌 `div` 태그를 가리키게 된다.

### 👀 `this` 바인딩 문제 해결하기

그!래!서! `this` 자체가 `class Cards` 자체를 가리키도록 바인딩 해줘야 한다.

함수를 건내줄 때 `.bind(this)` 를 통해 바인딩 해줘도 되겠지만 더 명시적으로 하기 위해

메소드들을 모두 **화살표 함수**로 변경해주었다.

화살표 함수는 `this` 자체가 존재하지 않기 때문에 선언 즉시, 자신이 선언된 상위 렉시컬 환경의 `this` 와 바인딩 된다.

> 클래스 내부에서는 화살표 함수가 아니라 메소드들을 사용해야 하는게 아닌가 .. 하는 생각이 있었지만, `class Cards` 는 인스턴스를 생성하기 위한 생성자가 아니라 함수들의 묶음이기 때문에 무리가 없을 것이라 생각했다.

### 🐧 리팩토링 결과물

#### `calucateOffset , makeEffect , changeCard , moveCard`

```js
class Cards{
  ...
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
    current.style.transform = `
	translate3D(${offset.X}px ,${offset.Y}px , 10px)
    rotate(${effects.rot}deg)`;
    current.style.boxShadow = `0px 0px 50px 50px ${effects.shadow};`;
  };

  moveCard = (event) => {
    const offset = this.calculateOffset(event);
    const effects = this.makeEffect(offset.X);
    this.changeCard(offset, effects);
  };

	...
}
```

카드의 이동 거리를 구하는 `calucateOffset` 메소드와 그림자와 각도를 계산하는 `makeEffect` 메소드를 화살표 함수로 선언해준 후 `changeCard` 로 캡슐화 해줬다.

이후 이벤트 핸들러로 등록될 `moveCard` 에선 세 가지 메소드를 호출해주도록 하였다.

#### `chooseCard` , `initializeCard` , `clearAllEvent` , `terminateEvent`

```js
class Cards{
	...
      chooseCard = (delay = 1000) => {
    const { current, offset } = this;
    current.style.transition = `all ${delay}ms`;
    current.style.transform = `translate3D(${offset.X * 5}px , ${
      offset.Y * 5
    }px , 0px)`;

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
	...
}
```

카드를 선택후 포인터를 똇을 때 기존 임계점을 넘지 않으면 기존 선으로 돌아오도록 하는 `initializeCard` 메소드와 넘었을 경우엔 카드 리스트에서 삭제하는 `chooseCard` 메소드를 선언해주었다.

이후 이벤트들을 모두 초기화 해주는 메소드도 등록해주었다.

`this.setup()` 메소드를 비동기적으로 `pointup` 단계에서 모두 호출해주었다.

#### `setAllEvent , setupCard` , `setup`

```js
class Cards {
  constructor() {
    this.wrapper = document.querySelector('.card-wrapper');
    this.cardWidth = document.querySelector('.card').clientWidth;
    this.setup(); /* 처음 호출 될 때 setup 메소드가 호출된다 */
  }
  ...
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
  ...
}
```

카드를 선택하는 `pointdown` 이벤트가 발생했을 때 호출되는 메소드들이다.

`setupCard` 이벤트 핸들러가 `pointdown` 시 호출되면서 해당 카드에 모든 이벤트 핸들러들이 등록된다.

---

# 🐤 `API` 요청으로 무한 스와이프 만들기

이벤트 핸들러로 작동하는 거는 만들었으니

이제 카드들이 무한하게 작성되도록 `API` 요청을 보내야 한다.

### `deque` 자료구조 만들기

```
[1번 대기 카드 , 2번 대기 카드 , 3번 대기 카드 ] == 채워주기 ==>
[1번 카드 , 2번카드 , 3번카드 ] == 스와이프 ==> 꺼내기
```

카드를 하나씩 뽑을 때 마다 새로운 카드들을 카드의 맨 뒤에 담아주도록 하자

그렇기 위해 `API` 요청을 보내 먼저 대기 시킨 카드들을 먼저 꺼내 카드 리스트에 넣어주기 위해 `dequeue` 자료구조가 필요하다.

그런데 자바스크립트 내장 모듈에는 없으니 구현해주었다.

```js
export default class deque {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(node) {
    if (!this.length) {
      /* 아무런 노드가 존재하지 않으면 들어오는 노드가 head 며 tail */
      this.head = node;
      this.tail = node;
      this.length += 1;
      return;
    }
    if (this.length === 1) {
      /* 노드가 하나만 존재하면 들어오는 노드가 tail 이 됨 */
      this.head.next = node;
      this.tail = node;
      node.prev = this.head;
      this.length += 1;
      return;
    }
    /* 노드가 2개 이상일 때에는 tail의 next 로 연결시켜주면 됨 */
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
    this.length += 1;
  }

  appendLeft(node) {
    if (!this.length) {
      this.append(node);
      return;
    }
    this.head.prev = node;
    node.next = this.head;
    this.head = node;
    this.length += 1;
  }

  pop() {
    if (!this.length) return new Error('deque is Empty !');

    const returnNode = this.tail;

    if (this.length >= 2) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
      this.length -= 1;
      return returnNode;
    }
    this.length -= 1;
    return returnNode;
  }

  popleft() {
    if (!this.length) return new Error('deque is Empty');

    const returnNode = this.head;
    if (this.length >= 2) {
      this.head.next.prev = null;
      this.head = this.head.next;
      this.length -= 1;
      return returnNode;
    }
    this.length -= 1;
    return returnNode;
  }
}
```

> 사실 어차피 `API` 요청을 5개씩 보낼 것이라 그냥 `unshift` 를 써도 되지만 기왕 하는 김에 구현해봤다.

연결리스트를 이용해 `dequeue` 를 구현해줬으니

연결리스트에서 연결 될 `node` 들을 생성해주자

### `Response` 이용해 컴포넌트 만들기

```
[{"id":"die",
"url":"https://cdn2.thecatapi.com/images/die.jpg",
"width":600,
"height":600}]
```

`API` 요청을 받으면 받아지는 정보들은 이렇게 생겼으니 `id , url` 를 정보로 담는 노드들을 만들어주자

```js
export default class InfoNode {
  constructor(res) {
    this.id = res.id;
    this.url = res.url;
    this.next = null;
    this.prev = null;
    this.createNode();
  }

  createNode() {
    const { id, url } = this;
    const customStyle = `background : url("${url}");
					background-size : cover; background-position : center;`;

    const $pseudo = document.createElement('div');
    $pseudo.innerHTML = `
    <div class="card" style = '${customStyle}' >
      <div class = 'info-wrapper'>
      <p class="person-name">${id}</p>
      <p class="person-greet">Hello :)</p>
      </div>
    </div>`;

    this.node = $pseudo.firstElementChild;
  }
}
```

노드를 만들 때 `node` 값에 컴포넌트들을 생성해주자

이렇게 되면 `InfoNode.node` 를 카드를 담고 있는 `card-wrapper` 에 첫번째 자식노드로 추가만 해주면 무한 스와이프를 할 준비가 끝난다.

`constructor` 내부에서 `createNode` 메소드를 실행시켜주으로서 생성과 함께 컴포넌트가 생성된다.

### `API` 요청 받아와 자료구조 만들기

```js
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
      .then(render)
      .catch((e) => {
        /* 너무 자주 요청을 보내 error 상태코드가 뜨면 
        3초후 다시 요청을 보내도록 함 
        */
        console.error(e);
        setTimeout(() => {
          this.fetchImg();
        }, 3000);
      });
  }
}
```

자료구조를 담을 `dequeue` 를 상속받은 `APIdeqeue` 를 생성해주자

`APIdequeue` 는 파싱해온 `id , url` 들을 담은 `InfoNode` 들을 자료구조에 담고 `render` 메소드를 통해 카드 뒤편으로 추가해준다.

> 코드들을 모듈화 시켜서 여기저기서 호출해주니까 `this` 바인딩이 모두 꼬여서 `bind` 메소드를 여기저기 붙여주었다.
> 오류가 안날 때 까지 여기저기 바인딩을 했다 말았다를 반복했다.
> 모듈화 했을 때 `this` 들이 어떻게 설정되는지 시간내서 더 공부해봐야겠다.

그럼 이제 `API` 요청을 저장 할 자료구조인 `InfoNode` 도 생성했고

`InfoNode` 들을 저장할 `APIdeqeue` 도 저장해줬다.

이제는 **카드가 스와이프 될 때 마다 어떤 임계점마다 `API` 요청을 받아오도록 해주면 된다.**

### 무한 스와이프 하도록 구현하기

```js
import APIdeque from './APIdeque.js';

export default class Cards {
  constructor() {
    this.wrapper = document.querySelector('.card-wrapper');
    this.cardWidth = document.querySelector('.card').clientWidth;
    this.setup();
    this.mounted(); /* 새롭게 추가 */
  }

 	...
  chooseCard = (delay = 1000) => {
    const { current, offset } = this;
    current.style.transition = `all ${delay}ms`;
    current.style.transform = `
	translate3D(${offset.X * 5}px , ${
      offset.Y * 5
    }px , 0px)`;

     /* 카드가 하나 선택 될 때 마다 카드 개수 1개 감소 */
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

 ...

  mounted() { /* Cards 가 호출된 후 실행되는 메소드 */
    this.deque = new APIdeque();
    this.count = 6; /* fetchImg 를 통해 최초로 가져온 이미지 개수 */
  }
}
```

![](https://velog.velcdn.com/images/yonghyeun/post/08eb54bd-0ba2-4538-b066-779a7afc097e/image.gif)

카드가 하나 선택 될 때 마다 `this.count` 를 하나씩 감소시켜주자

이후 `this.count` 가 5개 이하가 되면 다시 6개를 파싱해와 채워주도록 하였다.

파싱 이후 채워주는 행위를 `async/await` 가 아닌 프로미스 체이닝을 이용해줘

파싱해오는 동안에도 여전히 스와이프가 가능하도록 만들어주었다.

---

# 🐤 모듈화해서 완성하자

```
MeowTinder
├─ index.html
├─ main.js /* 엔트리 파일 */
├─ src
│  ├─ APIdeque.js
│  ├─ Cards.js
│  ├─ deque.js
│  ├─ heart.svg
│  └─ InfoNode.js
└─ style.css
```

파일 디렉토리를 다음처럼 구성해준 후 엔트리 파일에서 함수를 호출해주도록 하자

```js
/* main.js */
import Cards from './src/Cards.js';
new Cards();
```

![](https://velog.velcdn.com/images/yonghyeun/post/d79215c1-3cee-4876-b47f-d9c33f43d254/image.gif)

> <a href = 'https://yonghyeun.github.io/MeowTinder/'>완성본 페이지</a> > <a href= 'https://github.com/yonghyeun/MeowTinder'>코드 전문</a>

---

# 😂 회고

![](https://velog.velcdn.com/images/yonghyeun/post/147253f6-9487-4c49-9b84-6d4ffff3379c/image.gif)

토이프로젝트를 안한지 일주일 정도 지나니까 너무 심심해서

유튜브에서 주제를 탐방하고 재밌어보이는 것을 만들어봤다.

내가 생각했던 것보다 오래걸렸는데

그 이유는 `this` 이 놈 때문이였다.

모듈로 파편화 된 여러 클래스들에서 여기 저기서 호출되는 `this` 들을 추적하는게 너무 어려웠다.

운 좋게도 최근에 `this` 와 관련된 여러 메소드들을 한 번 더 훑었어서 `this` 가 문제란 것은 금방 알아차릴 수 있었으나

문제를 해결하는 것은 너무 어려웠다.

> 심지어 구현이 된 지금도 어떻게 `this` 들이 호출되고 있는지 상상이 잘 안된다.

이틀 밖에 안걸린 토이프로젝트였으나 하면서 가장 느낀건

**키보드 두들기기 전에 깊게 생각하고 문서화 하자** 였다.

완성에 가까워질 수록 마음만 급해져서 깊게 생각안하고 코드만 계속 치다보니

시간을 많이 잡아먹었다. 머리속으로 곰곰히 생각하기 ..

끝~!!
