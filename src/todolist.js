import React, { useEffect } from 'react';
import './todolist.css'
import SubList  from './sublist';
import { useState } from 'react/cjs/react.development';

function storeTreetolocalStorage(todotree){
    const tree = JSON.stringify(todotree);
    localStorage.setItem('toDoList',tree);
}
function handleCreateSubList(todoTree,setTodoTree){
    // use the time created as id
    const listid = Date.now();
    let todotree = todoTree.slice()
    let newtodotree = todotree.concat([{id: listid, tree: [], sublistTitle: "To-do"}])
    setTodoTree(newtodotree);
    console.log("clicked",listid);
    storeTreetolocalStorage(newtodotree);
}
function isIdSame(item){
    return item.id === this;
}
function storeSublist(todotree,setTodoTree,target){
    let todoTree = todotree.slice();
    for (let sublist in todoTree){
        if(todoTree[sublist].id === target.id){
            todoTree[sublist] = target;
            setTodoTree(todoTree)
            storeTreetolocalStorage(todoTree)
            return
        }
    }
}

function handleDeleteSubList(id,todoTree,setTodoTree){
    let todotree = todoTree.slice();
    let pos,removedid;
    pos = todotree.findIndex(isIdSame,id);
    removedid = todotree.splice(pos,1);
    setTodoTree(todotree)
    storeTreetolocalStorage(todotree);
}

function ToDoList() {
    const[todoTree,setTodoTree] = useState([]);
    useEffect(()=>{
        const storedtree = localStorage.getItem('toDoList');
        let parsedtree;
        if(storedtree){
            parsedtree = JSON.parse(storedtree);
        }else{//load example
            parsedtree = [{"id":1636337260150,"tree":[{"id":1636337442117,"value":"Play apex","checked":true,"focus":false},{"id":1636337872537,"value":"learn Redux","checked":false,"focus":false}],"sublistTitle":"Click to edit todo list title"}]
        }
        let idlist = [];
        parsedtree.map((list)=>{
            idlist = idlist.concat([list.id]);
        })
        setTodoTree(parsedtree);
    },[])//should only check when mount


    // const idlist = this.state.idlist.slice()
    const nodeidlist = todoTree.map((sublist) => {
        return(
            <SubList
                key={sublist.id}
                listid={sublist.id}
                sublist={sublist}
                storeSublist={(e)=>storeSublist(todoTree,setTodoTree,e)}
                handleDeleteSubList={()=>handleDeleteSubList(sublist.id,todoTree,setTodoTree)}
            />
        )
    })

    return(
        <div className="todo-list-container">
            <h2>This is todo list</h2>
            <p>contenteditable and stored in localStorage</p>
            <div className="sublist-container">
                <div className="todo-create-btn-container">
                    {nodeidlist}
                    <button 
                        className="create-todo-list-btn"
                        onClick={() => handleCreateSubList(todoTree,setTodoTree)}
                        >
                        +
                    </button>
                </div>
            </div>
        </div>       
    )
}



export default ToDoList;