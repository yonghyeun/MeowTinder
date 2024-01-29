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
