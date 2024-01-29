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
    const customStyle = `background : url("${url}"); background-size : cover; background-position : center;`;

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
