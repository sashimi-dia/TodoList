//todoリストDOM掴み
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const removeModeBtn = document.getElementById("removeModeBtn");
const todoList = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");

//状態
let todos = [];
let removeMode = false;


//todo操作

//要素生成
const createTaskText = (text)=>{
    const span = document.createElement("span");
    span.textContent = text;
    span.classList.add("taskText");
    return span;
};

const createBtn = (text, className, action)=>{
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.dataset.action = action;
    return button;
};

//チェックボックス生成
const createCheckbox = (selected,id)=>{
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const checkboxId = `checkbox-${id}`;
    checkbox.type = "checkbox";
    checkbox.checked = selected;
    checkbox.id = checkboxId;
    checkbox.dataset.action = "select";
    label.htmlFor = checkboxId;
    label.classList.add("checkboxLabel")
    label.appendChild(checkbox);
    return label;
};

//削除実行ボタン生成
const removeSelectedBtn = document.createElement("button");
removeSelectedBtn.textContent = "選択した項目を削除";
removeSelectedBtn.id = "removeSelectedBtn";
removeSelectedBtn.classList.add("removeBtn");

//状態変更関数
const updateTodo = (id, updater) => {
    todos = todos.map(todo =>
        todo.id === id ? updater(todo) : todo
    );
    taskRender();
};

//複数選択関数
const selectedItem = (id)=>{
    todos = todos.map(todo =>
        todo.id === id
          ? { ...todo, selected: !todo.selected }
          : todo
      );
    taskRender();
};

//選択リセット関数
const resetSelected = ()=>{
    todos = todos.map(todo =>
    ({
        ...todo, selected:false
    })
    );
};

//削除関数
const removeTask = (id)=>{
    todos = todos.filter(todo => todo.id !==id);
    taskRender();
};

//一括削除関数
const removeSelectedTasks = () => {
    todos = todos.filter(todo => !todo.selected);
    taskRender();
};

//編集開始関数
const startEdit = (id) => {
    updateTodo(id, todo =>({...todo,editing:true}));
    taskRender();
    const li = todoList.querySelector(`[data-id="${id}"]`);
    const input = li?.querySelector("input");
    input?.focus();
};

//編集終了関数
const finishEdit = (id,newText)=>{
    // if(!newText)removeTask(id);
    if(!newText.trim()){
        removeTask(id);
        return;
    }
    updateTodo(id, todo =>({...todo,text:newText,editing:false}));
};

//追加機能
const addTask = () =>{
    const text = todoInput.value.trim();
    if (!text) return;
    todos = [...todos,{
        id: Date.now(),
        text,
        remove:false,
        completed:false,
        editing: false,
        selected: false
    }];
    todoInput.value = "";
    taskRender();

};


//タスクDOM生成
const createTodoItem = (todo)=>{
    
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    const removeBtn = createBtn("削除","removeBtn","remove");
    const editBtn = createBtn("編集","editBtn","edit");

    const taskContent = document.createElement("div");
    taskContent.classList.add("taskContent");

    const actionArea = document.createElement("div");
    actionArea.classList.add("actionArea");
    
    if(todo.editing){
        const input = document.createElement("input");
        input.value = todo.text;
        taskContent.append(input);
    }else{
    const taskText = createTaskText(todo.text);
    taskContent.append(taskText);
    };
    if (removeMode) {
        const checkbox = createCheckbox(todo.selected,todo.id);
        actionArea.append(checkbox);
    }
    else{
        actionArea.append(removeBtn,editBtn);
    };
    li.append(taskContent,actionArea)
    return li;
};
//タスクrender
const taskRender = ()=>{
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = createTodoItem(todo);
        todoList.appendChild(li);
    });

    if (removeMode) {
        todoList.append(removeSelectedBtn);
    } else {
        removeSelectedBtn.remove();
    };
};



//addEventListener

//追加ボタンでタスク追加
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});

//クリックで処理開始。削除,編集
todoList.addEventListener("click", (e)=>{
    const li = e.target.closest("li");
    if(!li) return;
    const id =Number(li.dataset.id);
    const action = e.target.dataset.action;
    if(action === "remove"){
        removeTask(id);
    };
    if(action === "edit"){
        const targetTodo = todos.find(todo => todo.id === id);
        if(targetTodo.editing){
            const input = li.querySelector("input");
            finishEdit(id,input.value);
        }else{
            startEdit(id);
        };
    };
    if(action === "select"){
        selectedItem(id);
    };
});
todoList.addEventListener("keydown", (e) =>{
    if (e.key !== "Enter") return;

    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    finishEdit(id, e.target.value);
});

todoList.addEventListener("focusout", (e) => {
    if (e.target.tagName !== "INPUT") return;
    if (!e.target.closest("li")) return;
    if (e.target.type === "checkbox") return;

    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    finishEdit(id, e.target.value);
});

//削除モード切り替え
removeModeBtn.addEventListener("click", () => {
    removeMode = !removeMode;

    if(removeMode){
        removeModeBtn.textContent ="削除終了";
        removeModeBtn.classList.add("removeMode");
    }else{
        removeModeBtn.textContent ="削除モード";
        removeModeBtn.classList.remove("removeMode");
        resetSelected();
    }
    taskRender();
});

//まとめて削除実行
removeSelectedBtn.addEventListener("click", () => {
    removeSelectedTasks();
});

