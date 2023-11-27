showTasks(); // отобразить все задачи

let stat = new Map();
stat.set(true, "Выполнена");
stat.set(false, "Не выполнена");

let addButton = document.querySelector('.addButton');
addButton.addEventListener('click',function(event) {
  event.preventDefault();
  
  if (formElem.title.value != "") {
    let data = {
      title: formElem.title.value,
    };

     fetch(URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    createElem(table, data);
  } else {
    formElem.children[0].classList.add("error");
    setTimeout(() => {
      formElem.children[0].classList.remove("error");
    }, 1000);
  }
});

//вставка HTML элемента
function createElem(cont, task) {
  const newTaskElem = document.createElement("div");
  newTaskElem.classList.add("task");
  newTaskElem.id = task.id;
  newTaskElem.innerHTML = `
    ${task.title}
    <span class='status ${(task.done) ? 'isDone' : ''}'>
      ${stat.get(Boolean(task.done))}
    </span>
    <span class='delete'><span class='icon'></span></span>
  `;
  newTaskElem.querySelector(".delete").onclick = function (e) {
    e.stopPropagation(); //На всякий случай

     fetch(URL, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: task.id,
      }),
    });
    newTaskElem.remove();
  };

  newTaskElem.onclick = function (e) {
     fetch(URL, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        done: !task.done,
      }),
    });
    newTaskElem.children[0].classList.toggle("isDone");
    newTaskElem.children[0].innerHTML = stat.get(!Boolean(task.done));
  };

  cont.appendChild(newTaskElem);

}

async function showTasks() {
  let res = await fetch(URL, {
    method: "GET",
  });
  let result = await res.json();
  for (const task of result) {
    createElem(table, task);
  }
}