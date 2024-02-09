const btn = document.querySelectorAll('button');
const list = document.querySelectorAll('ul');
for (let index = 0; index < btn.length; index++) {
    btn[index].addEventListener('click', () => {
        list.forEach((l, i) => {
            if (index == i) {
                l.classList.toggle('closed')
            }
        })
    })
}